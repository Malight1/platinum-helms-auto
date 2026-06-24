// Stats service - Dashboard analytics and statistics
const { prisma } = require('../config/database');
const { CAR_STATUS, LEAD_STATUS } = require('../config/constants');

/**
 * Get dashboard statistics
 * @returns {Promise<object>} Dashboard stats
 */
const getDashboardStats = async () => {
  // Resolve a query but never let a single failure take down the whole
  // dashboard — return a safe fallback and keep going. This keeps the
  // endpoint resilient on flaky/connection-limited database hosts.
  const safe = (promise, fallback) =>
    promise.catch((error) => {
      console.error('Dashboard stat query failed:', error.message);
      return fallback;
    });

  // Execute all queries in parallel for performance
  const [
    totalCars,
    activeCars,
    soldCars,
    totalFinancingLeads,
    pendingFinancingLeads,
    approvedFinancingLeads,
    totalImportationLeads,
    pendingImportationLeads,
    totalContactMessages,
    newContactMessages,
    popularCars,
    recentFinancingLeads,
    recentImportationLeads,
  ] = await Promise.all([
    // Car statistics
    safe(prisma.car.count(), 0),
    safe(prisma.car.count({
      where: {
        status: CAR_STATUS.AVAILABLE,
        visibility: true,
      },
    }), 0),
    safe(prisma.car.count({
      where: { status: CAR_STATUS.SOLD },
    }), 0),

    // Financing lead statistics
    safe(prisma.financingLead.count(), 0),
    safe(prisma.financingLead.count({
      where: { status: LEAD_STATUS.PENDING },
    }), 0),
    safe(prisma.financingLead.count({
      where: { status: LEAD_STATUS.APPROVED },
    }), 0),

    // Importation lead statistics
    safe(prisma.importationLead.count(), 0),
    safe(prisma.importationLead.count({
      where: { status: LEAD_STATUS.PENDING },
    }), 0),

    // Contact message statistics
    safe(prisma.contactMessage.count(), 0),
    safe(prisma.contactMessage.count({
      where: { status: 'new' },
    }), 0),

    // Popular cars (top 5 by views)
    safe(prisma.car.findMany({
      where: {
        visibility: true,
        status: CAR_STATUS.AVAILABLE,
      },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        views: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    }), []),

    // Recent financing leads
    safe(prisma.financingLead.findMany({
      orderBy: { submissionDate: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        submissionDate: true,
        selectedCar: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
          },
        },
      },
    }), []),

    // Recent importation leads
    safe(prisma.importationLead.findMany({
      orderBy: { submissionDate: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        desiredCar: true,
        status: true,
        submissionDate: true,
      },
    }), []),
  ]);

  // Format popular cars
  const formattedPopularCars = popularCars.map(car => ({
    ...car,
    price: parseFloat(car.price),
    image: car.images[0]?.url || null,
  }));

  return {
    overview: {
      totalCars,
      activeCars,
      soldCars,
      totalLeads: totalFinancingLeads + totalImportationLeads,
      totalFinancingLeads,
      pendingFinancingLeads,
      approvedFinancingLeads,
      totalImportationLeads,
      pendingImportationLeads,
      totalContactMessages,
      newContactMessages,
    },
    popularCars: formattedPopularCars,
    recentActivity: {
      financingLeads: recentFinancingLeads,
      importationLeads: recentImportationLeads,
    },
  };
};

/**
 * Get car statistics by category
 * @returns {Promise<array>} Cars by category
 */
const getCarsByCategory = async () => {
  const stats = await prisma.car.groupBy({
    by: ['category'],
    where: {
      visibility: true,
      status: CAR_STATUS.AVAILABLE,
    },
    _count: {
      category: true,
    },
  });

  return stats.map(stat => ({
    category: stat.category,
    count: stat._count.category,
  }));
};

/**
 * Get car statistics by condition
 * @returns {Promise<array>} Cars by condition
 */
const getCarsByCondition = async () => {
  const stats = await prisma.car.groupBy({
    by: ['condition'],
    where: {
      visibility: true,
      status: CAR_STATUS.AVAILABLE,
    },
    _count: {
      condition: true,
    },
  });

  return stats.map(stat => ({
    condition: stat.condition,
    count: stat._count.condition,
  }));
};

/**
 * Get lead statistics by status
 * @returns {Promise<object>} Lead status breakdown
 */
const getLeadsByStatus = async () => {
  const [financingStats, importationStats] = await Promise.all([
    prisma.financingLead.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    }),
    prisma.importationLead.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    }),
  ]);

  return {
    financing: financingStats.map(stat => ({
      status: stat.status,
      count: stat._count.status,
    })),
    importation: importationStats.map(stat => ({
      status: stat.status,
      count: stat._count.status,
    })),
  };
};

/**
 * Get recent activity (last 30 days)
 * @returns {Promise<object>} Recent activity stats
 */
const getRecentActivity = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    newCars,
    newFinancingLeads,
    newImportationLeads,
    newContactMessages,
  ] = await Promise.all([
    prisma.car.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.financingLead.count({
      where: {
        submissionDate: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.importationLead.count({
      where: {
        submissionDate: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.contactMessage.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
  ]);

  return {
    period: 'Last 30 days',
    newCars,
    newFinancingLeads,
    newImportationLeads,
    newContactMessages,
    totalNewLeads: newFinancingLeads + newImportationLeads,
  };
};

module.exports = {
  getDashboardStats,
  getCarsByCategory,
  getCarsByCondition,
  getLeadsByStatus,
  getRecentActivity,
};
