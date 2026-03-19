import type {
  Item, ItemCategory, Warehouse, StockMovement, Contact,
  PurchaseOrder, SalesOrder, Employee, Vehicle, AuditLog, DashboardStats,
} from '@/types';

// ─── Categories ───────────────────────────────────────────
export const mockCategories: ItemCategory[] = [
  { id: 'cat-1', nameAr: 'حبوب', nameEn: 'Grains', color: '#f59e0b', itemCount: 12 },
  { id: 'cat-2', nameAr: 'بقوليات', nameEn: 'Legumes', color: '#10b981', itemCount: 8 },
  { id: 'cat-3', nameAr: 'أجبان وألبان', nameEn: 'Dairy', color: '#3b82f6', itemCount: 15 },
  { id: 'cat-4', nameAr: 'مكسرات', nameEn: 'Nuts', color: '#8b5cf6', itemCount: 10 },
  { id: 'cat-5', nameAr: 'زيوت', nameEn: 'Oils', color: '#f97316', itemCount: 7 },
  { id: 'cat-6', nameAr: 'توابل وبهارات', nameEn: 'Spices', color: '#ef4444', itemCount: 20 },
];

// ─── Items ────────────────────────────────────────────────
export const mockItems: Item[] = [
  {
    id: 'item-1', sku: 'GR-001', barcode: '6281234567890',
    nameAr: 'أرز بسمتي هندي', nameEn: 'Indian Basmati Rice',
    category: mockCategories[0], brand: 'Royal',
    storageType: 'dry', baseUnit: 'kg',
    weightPerUnit: 1, shelfLifeDays: 730,
    minimumStock: 500, maximumStock: 5000, reorderPoint: 800,
    isBatchTracked: true, isSerialTracked: false,
    taxRate: 15, status: 'active', currentStock: 2500,
    unitConversions: [
      { fromUnit: 'carton', toUnit: 'kg', factor: 25 },
      { fromUnit: 'pallet', toUnit: 'carton', factor: 40 },
    ],
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'item-2', sku: 'GR-002', barcode: '6281234567891',
    nameAr: 'قمح كامل', nameEn: 'Whole Wheat',
    category: mockCategories[0], brand: 'Gold',
    storageType: 'dry', baseUnit: 'kg',
    minimumStock: 300, reorderPoint: 400,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 0, status: 'active', currentStock: 180,
    createdAt: '2025-01-12T08:00:00Z', updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'item-3', sku: 'LG-001', barcode: '6281234567892',
    nameAr: 'عدس أحمر', nameEn: 'Red Lentils',
    category: mockCategories[1],
    storageType: 'dry', baseUnit: 'kg',
    minimumStock: 200, reorderPoint: 300,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 0, status: 'active', currentStock: 800,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'item-4', sku: 'DR-001', barcode: '6281234567893',
    nameAr: 'جبنة بيضاء', nameEn: 'White Cheese',
    category: mockCategories[2], brand: 'AlMarai',
    storageType: 'refrigerated', baseUnit: 'carton',
    shelfLifeDays: 90,
    minimumStock: 50, reorderPoint: 70,
    isBatchTracked: true, isSerialTracked: false,
    taxRate: 15, status: 'active', currentStock: 45,
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'item-5', sku: 'NT-001', barcode: '6281234567894',
    nameAr: 'كاجو محمص', nameEn: 'Roasted Cashews',
    category: mockCategories[3],
    storageType: 'dry', baseUnit: 'kg',
    shelfLifeDays: 180,
    minimumStock: 100, reorderPoint: 150,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 15, status: 'active', currentStock: 320,
    createdAt: '2025-03-01T08:00:00Z', updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'item-6', sku: 'OL-001', barcode: '6281234567895',
    nameAr: 'زيت زيتون بكر', nameEn: 'Extra Virgin Olive Oil',
    category: mockCategories[4], brand: 'Nar',
    storageType: 'dry', baseUnit: 'liter',
    shelfLifeDays: 540,
    minimumStock: 200, reorderPoint: 300,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 15, status: 'active', currentStock: 650,
    createdAt: '2025-01-05T08:00:00Z', updatedAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'item-7', sku: 'DR-002', barcode: '6281234567896',
    nameAr: 'حليب بودرة', nameEn: 'Powdered Milk',
    category: mockCategories[2], brand: 'Nido',
    storageType: 'dry', baseUnit: 'carton',
    shelfLifeDays: 365,
    minimumStock: 30, reorderPoint: 45,
    isBatchTracked: true, isSerialTracked: false,
    taxRate: 0, status: 'active', currentStock: 12,
    createdAt: '2025-02-15T08:00:00Z', updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'item-8', sku: 'LG-002', barcode: '6281234567897',
    nameAr: 'فاصوليا بيضاء', nameEn: 'White Beans',
    category: mockCategories[1],
    storageType: 'dry', baseUnit: 'kg',
    minimumStock: 300, reorderPoint: 400,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 0, status: 'active', currentStock: 1200,
    createdAt: '2025-01-25T08:00:00Z', updatedAt: '2026-03-03T10:00:00Z',
  },
  {
    id: 'item-9', sku: 'SP-001', barcode: '6281234567898',
    nameAr: 'كمون مطحون', nameEn: 'Ground Cumin',
    category: mockCategories[5],
    storageType: 'dry', baseUnit: 'kg',
    shelfLifeDays: 730,
    minimumStock: 50, reorderPoint: 75,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 15, status: 'active', currentStock: 280,
    createdAt: '2025-04-01T08:00:00Z', updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'item-10', sku: 'OL-002', barcode: '6281234567899',
    nameAr: 'زيت نخيل', nameEn: 'Palm Oil',
    category: mockCategories[4],
    storageType: 'dry', baseUnit: 'liter',
    minimumStock: 500, reorderPoint: 700,
    isBatchTracked: false, isSerialTracked: false,
    taxRate: 15, status: 'discontinued', currentStock: 0,
    createdAt: '2024-11-01T08:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
];

// ─── Warehouses ───────────────────────────────────────────
export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-1', code: 'RUH-MAIN', nameAr: 'مستودع الرياض الرئيسي', nameEn: 'Riyadh Main Warehouse',
    type: 'main', address: 'طريق الملك فهد، حي العليا', city: 'الرياض',
    capacity: 50000, usedCapacity: 32000, managerName: 'محمد العتيبي',
    phone: '+966501234567', isActive: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh-2', code: 'JED-01', nameAr: 'مستودع جدة', nameEn: 'Jeddah Warehouse',
    type: 'branch', address: 'طريق المدينة المنورة، جدة', city: 'جدة',
    capacity: 30000, usedCapacity: 18000, managerName: 'خالد الحربي',
    phone: '+966507654321', isActive: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh-3', code: 'DMM-01', nameAr: 'مستودع الدمام', nameEn: 'Dammam Warehouse',
    type: 'branch', address: 'طريق الملك عبدالعزيز، الدمام', city: 'الدمام',
    capacity: 25000, usedCapacity: 11000, managerName: 'فهد السبيعي',
    phone: '+966509876543', isActive: true, createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'wh-4', code: 'MED-01', nameAr: 'مستودع المدينة المنورة', nameEn: 'Madinah Warehouse',
    type: 'branch', address: 'طريق قباء', city: 'المدينة المنورة',
    capacity: 15000, usedCapacity: 7500, managerName: 'عمر الزهراني',
    phone: '+966506543210', isActive: true, createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'wh-5', code: 'RUH-COLD', nameAr: 'مستودع التبريد الرياض', nameEn: 'Riyadh Cold Storage',
    type: 'cold_storage', address: 'المنطقة الصناعية، الرياض', city: 'الرياض',
    capacity: 10000, usedCapacity: 8500, managerName: 'ناصر القحطاني',
    phone: '+966502345678', isActive: true, createdAt: '2024-04-01T00:00:00Z',
  },
];

// ─── Transfers ────────────────────────────────────────────
export const mockTransfers: StockMovement[] = [
  {
    id: 'tr-1', referenceNo: 'TR-2026-001', type: 'transfer', status: 'in_transit',
    itemId: 'item-1', item: mockItems[0],
    fromWarehouseId: 'wh-1', fromWarehouse: mockWarehouses[0],
    toWarehouseId: 'wh-2', toWarehouse: mockWarehouses[1],
    quantity: 500, unit: 'kg',
    requestedById: 'user-1', requestedByName: 'محمد العتيبي',
    approvedById: 'user-2', approvedByName: 'أحمد المدير',
    driverName: 'أحمد محمد', vehicleNo: 'أ ب ج 1234',
    createdAt: '2026-03-15T09:00:00Z', updatedAt: '2026-03-15T11:00:00Z',
  },
  {
    id: 'tr-2', referenceNo: 'TR-2026-002', type: 'transfer', status: 'pending',
    itemId: 'item-6', item: mockItems[5],
    fromWarehouseId: 'wh-3', fromWarehouse: mockWarehouses[2],
    toWarehouseId: 'wh-1', toWarehouse: mockWarehouses[0],
    quantity: 200, unit: 'liter',
    requestedById: 'user-3', requestedByName: 'فهد السبيعي',
    createdAt: '2026-03-16T10:00:00Z', updatedAt: '2026-03-16T10:00:00Z',
  },
  {
    id: 'tr-3', referenceNo: 'TR-2026-003', type: 'transfer', status: 'completed',
    itemId: 'item-3', item: mockItems[2],
    fromWarehouseId: 'wh-2', fromWarehouse: mockWarehouses[1],
    toWarehouseId: 'wh-4', toWarehouse: mockWarehouses[3],
    quantity: 300, unit: 'kg',
    requestedById: 'user-4', requestedByName: 'خالد الحربي',
    approvedById: 'user-2', approvedByName: 'أحمد المدير',
    driverName: 'خالد سعيد', vehicleNo: 'د ه و 5678',
    createdAt: '2026-03-14T08:00:00Z', updatedAt: '2026-03-14T16:00:00Z',
  },
  {
    id: 'tr-4', referenceNo: 'TR-2026-004', type: 'transfer', status: 'pending',
    itemId: 'item-4', item: mockItems[3],
    fromWarehouseId: 'wh-1', fromWarehouse: mockWarehouses[0],
    toWarehouseId: 'wh-3', toWarehouse: mockWarehouses[2],
    quantity: 100, unit: 'carton',
    requestedById: 'user-1', requestedByName: 'محمد العتيبي',
    createdAt: '2026-03-17T14:00:00Z', updatedAt: '2026-03-17T14:00:00Z',
  },
  {
    id: 'tr-5', referenceNo: 'TR-2026-005', type: 'transfer', status: 'completed',
    itemId: 'item-5', item: mockItems[4],
    fromWarehouseId: 'wh-1', fromWarehouse: mockWarehouses[0],
    toWarehouseId: 'wh-2', toWarehouse: mockWarehouses[1],
    quantity: 150, unit: 'kg',
    requestedById: 'user-1', requestedByName: 'محمد العتيبي',
    approvedById: 'user-2', approvedByName: 'أحمد المدير',
    driverName: 'علي حسن', vehicleNo: 'ز ح ط 9012',
    createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-10T17:00:00Z',
  },
];

// ─── Suppliers ────────────────────────────────────────────
export const mockSuppliers: Contact[] = [
  {
    id: 'sup-1', type: 'supplier', code: 'SUP-001',
    nameAr: 'شركة الأغذية الخليجية', nameEn: 'Gulf Foods Company',
    phone: '+966501111111', email: 'info@gulffood.com',
    address: 'طريق الملك فهد', city: 'الرياض',
    taxNumber: '300123456700003', creditLimit: 500000, paymentTerms: 30,
    isActive: true, balance: -45000, totalPurchases: 1250000,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sup-2', type: 'supplier', code: 'SUP-002',
    nameAr: 'مؤسسة النور للتجارة', nameEn: 'Al Nour Trading Est.',
    phone: '+966502222222', email: 'orders@alnour.sa',
    address: 'حي الصناعية', city: 'جدة',
    taxNumber: '300234567800004', creditLimit: 300000, paymentTerms: 45,
    isActive: true, balance: -12000, totalPurchases: 780000,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'sup-3', type: 'supplier', code: 'SUP-003',
    nameAr: 'شركة الماسة للاستيراد', nameEn: 'Al Masa Import Co.',
    phone: '+966503333333', email: 'procurement@almasa.com',
    address: 'المنطقة الصناعية', city: 'الدمام',
    taxNumber: '300345678900005', creditLimit: 200000, paymentTerms: 30,
    isActive: true, balance: 5000, totalPurchases: 450000,
    createdAt: '2024-03-10T00:00:00Z',
  },
];

// ─── Customers ────────────────────────────────────────────
export const mockCustomers: Contact[] = [
  {
    id: 'cus-1', type: 'customer', code: 'CUS-001',
    nameAr: 'سوبرماركت الفرسان', nameEn: 'Al Fursan Supermarket',
    phone: '+966504444444', email: 'buying@fursan.com',
    address: 'شارع الأمير محمد', city: 'الرياض',
    taxNumber: '300456789000006', creditLimit: 150000, paymentTerms: 14,
    isActive: true, balance: 23000, totalSales: 560000,
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'cus-2', type: 'customer', code: 'CUS-002',
    nameAr: 'مطاعم الأصالة', nameEn: 'Al Asala Restaurants',
    phone: '+966505555555', email: 'supply@asala.com',
    address: 'حي العليا', city: 'الرياض',
    taxNumber: '300567890100007', creditLimit: 80000, paymentTerms: 7,
    isActive: true, balance: 8500, totalSales: 320000,
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'cus-3', type: 'customer', code: 'CUS-003',
    nameAr: 'شركة التموين الوطني', nameEn: 'National Catering Co.',
    phone: '+966506666666', email: 'orders@nacat.sa',
    address: 'طريق المطار', city: 'جدة',
    taxNumber: '300678901200008', creditLimit: 250000, paymentTerms: 30,
    isActive: true, balance: 67000, totalSales: 890000,
    createdAt: '2024-01-05T00:00:00Z',
  },
];

// ─── Employees ────────────────────────────────────────────
export const mockEmployees: Employee[] = [
  {
    id: 'emp-1', employeeNo: 'EMP-001', nameAr: 'أحمد محمد العتيبي', nameEn: 'Ahmed Al-Otaibi',
    role: 'مدير المستودع', department: 'العمليات', warehouseId: 'wh-1', warehouseName: 'مستودع الرياض الرئيسي',
    phone: '+966507777777', email: 'ahmed@wms.sa', hireDate: '2022-03-01',
    salary: 12000, status: 'active',
  },
  {
    id: 'emp-2', employeeNo: 'EMP-002', nameAr: 'خالد سعود الحربي', nameEn: 'Khalid Al-Harbi',
    role: 'مشرف عمليات', department: 'العمليات', warehouseId: 'wh-2', warehouseName: 'مستودع جدة',
    phone: '+966508888888', email: 'khalid@wms.sa', hireDate: '2022-06-15',
    salary: 9000, status: 'active',
  },
  {
    id: 'emp-3', employeeNo: 'EMP-003', nameAr: 'فاطمة علي الزهراني', nameEn: 'Fatima Al-Zahrani',
    role: 'محاسبة', department: 'المالية', warehouseId: 'wh-1', warehouseName: 'مستودع الرياض الرئيسي',
    phone: '+966509999999', email: 'fatima@wms.sa', hireDate: '2023-01-10',
    salary: 8500, status: 'active',
  },
  {
    id: 'emp-4', employeeNo: 'EMP-004', nameAr: 'عمر ناصر القحطاني', nameEn: 'Omar Al-Qahtani',
    role: 'سائق', department: 'الأسطول', warehouseId: 'wh-1', warehouseName: 'مستودع الرياض الرئيسي',
    phone: '+966500001111', email: 'omar@wms.sa', hireDate: '2023-04-20',
    salary: 6000, status: 'active',
  },
  {
    id: 'emp-5', employeeNo: 'EMP-005', nameAr: 'نورة محمد السبيعي', nameEn: 'Noura Al-Subaie',
    role: 'مراقب مخزون', department: 'المخزون', warehouseId: 'wh-3', warehouseName: 'مستودع الدمام',
    phone: '+966500002222', email: 'noura@wms.sa', hireDate: '2023-08-01',
    salary: 7000, status: 'on_leave',
  },
  {
    id: 'emp-6', employeeNo: 'EMP-006', nameAr: 'سعد فهد الدوسري', nameEn: 'Saad Al-Dosari',
    role: 'موظف استقبال', department: 'العمليات', warehouseId: 'wh-2', warehouseName: 'مستودع جدة',
    phone: '+966500003333', email: 'saad@wms.sa', hireDate: '2024-01-15',
    salary: 5500, status: 'active',
  },
];

// ─── Fleet ────────────────────────────────────────────────
export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-1', plateNo: 'أ ب ج 1234', type: 'شاحنة متوسطة', brand: 'Mercedes', model: 'Actros',
    year: 2022, capacity: 10000, unit: 'كجم', driverId: 'emp-4', driverName: 'عمر ناصر القحطاني',
    status: 'in_use', lastMaintenanceDate: '2026-02-01', nextMaintenanceDate: '2026-05-01', mileage: 45000,
  },
  {
    id: 'veh-2', plateNo: 'د ه و 5678', type: 'شاحنة كبيرة', brand: 'Volvo', model: 'FH',
    year: 2021, capacity: 25000, unit: 'كجم',
    status: 'available', lastMaintenanceDate: '2026-01-15', nextMaintenanceDate: '2026-04-15', mileage: 78000,
  },
  {
    id: 'veh-3', plateNo: 'ز ح ط 9012', type: 'مركبة مبردة', brand: 'Isuzu', model: 'NQR',
    year: 2023, capacity: 5000, unit: 'كجم',
    status: 'maintenance', lastMaintenanceDate: '2026-03-10', nextMaintenanceDate: '2026-06-10', mileage: 22000,
  },
  {
    id: 'veh-4', plateNo: 'ي ك ل 3456', type: 'سيارة توصيل', brand: 'Toyota', model: 'Hilux',
    year: 2023, capacity: 1000, unit: 'كجم',
    status: 'available', lastMaintenanceDate: '2026-03-01', nextMaintenanceDate: '2026-06-01', mileage: 15000,
  },
];

// ─── Dashboard Stats ──────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalItems: mockItems.length,
  criticalStock: mockItems.filter(
    (i) => i.currentStock !== undefined && i.currentStock < i.minimumStock
  ).length,
  nearExpiry: 3,
  pendingTransfers: mockTransfers.filter((t) => t.status === 'pending').length,
  todaySales: 34500,
  todayPurchases: 18200,
  presentEmployees: 42,
  totalEmployees: 48,
  activeWarehouses: mockWarehouses.filter((w) => w.isActive).length,
};

// ─── Sales Chart Data ─────────────────────────────────────
export const mockSalesChartData = [
  { name: 'السبت', sales: 4200, purchases: 2400 },
  { name: 'الأحد', sales: 3800, purchases: 1398 },
  { name: 'الاثنين', sales: 5200, purchases: 3800 },
  { name: 'الثلاثاء', sales: 4780, purchases: 3908 },
  { name: 'الأربعاء', sales: 5890, purchases: 4800 },
  { name: 'الخميس', sales: 6390, purchases: 3800 },
  { name: 'الجمعة', sales: 3490, purchases: 2300 },
];

export const mockCategoryChartData = mockCategories.map((cat) => ({
  name: cat.nameAr,
  value: cat.itemCount ?? 0,
}));

// ─── Audit Logs ───────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1', userId: 'emp-1', userName: 'أحمد محمد', userRole: 'manager',
    action: 'create', resource: 'transfer', resourceId: 'tr-1',
    newValue: { quantity: 500, item: 'أرز بسمتي' },
    ipAddress: '192.168.1.1', createdAt: '2026-03-15T09:05:00Z',
  },
  {
    id: 'log-2', userId: 'emp-3', userName: 'فاطمة علي', userRole: 'operator',
    action: 'update', resource: 'item', resourceId: 'item-1',
    oldValue: { minimumStock: 400 }, newValue: { minimumStock: 500 },
    ipAddress: '192.168.1.2', createdAt: '2026-03-14T14:30:00Z',
  },
  {
    id: 'log-3', userId: 'emp-1', userName: 'أحمد محمد', userRole: 'manager',
    action: 'approve', resource: 'transfer', resourceId: 'tr-3',
    ipAddress: '192.168.1.1', createdAt: '2026-03-14T10:00:00Z',
  },
];
