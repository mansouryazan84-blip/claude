// ─── User & Auth ──────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  warehouseId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Items / Products ─────────────────────────────────────
export type ItemUnit = 'kg' | 'gram' | 'ton' | 'liter' | 'ml' | 'piece' | 'box' | 'carton' | 'bag' | 'pallet' | 'barrel' | 'can';
export type StorageType = 'dry' | 'refrigerated' | 'frozen' | 'controlled';
export type ItemStatus = 'active' | 'discontinued' | 'pending_approval';

export interface UnitConversion {
  id?: string;
  fromUnit: ItemUnit;
  toUnit: ItemUnit;
  factor: number;
}

export interface ItemCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  color?: string;
  icon?: string;
  parentId?: string;
  parent?: ItemCategory;
  children?: ItemCategory[];
  itemCount?: number;
}

export interface Item {
  id: string;
  sku: string;
  barcode?: string;
  nameAr: string;
  nameEn: string;
  category: ItemCategory;
  subCategory?: ItemCategory;
  brand?: string;
  storageType: StorageType;
  baseUnit: ItemUnit;
  weightPerUnit?: number;
  volumePerUnit?: number;
  shelfLifeDays?: number;
  minimumStock: number;
  maximumStock?: number;
  reorderPoint: number;
  isBatchTracked: boolean;
  isSerialTracked: boolean;
  taxRate?: number;
  status: ItemStatus;
  images?: string[];
  notes?: string;
  unitConversions?: UnitConversion[];
  currentStock?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Warehouse ────────────────────────────────────────────
export type WarehouseType = 'main' | 'branch' | 'transit' | 'cold_storage';

export interface Warehouse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: WarehouseType;
  address: string;
  city: string;
  capacity?: number;
  usedCapacity?: number;
  managerId?: string;
  managerName?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseStock {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  item: Item;
  quantity: number;
  unit: ItemUnit;
  locationCode?: string;
  lastUpdated: string;
}

// ─── Stock Movements ──────────────────────────────────────
export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment' | 'return';
export type MovementStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled';

export interface StockMovement {
  id: string;
  referenceNo: string;
  type: MovementType;
  status: MovementStatus;
  itemId: string;
  item: Item;
  fromWarehouseId?: string;
  fromWarehouse?: Warehouse;
  toWarehouseId?: string;
  toWarehouse?: Warehouse;
  quantity: number;
  unit: ItemUnit;
  batchNo?: string;
  expiryDate?: string;
  notes?: string;
  requestedById: string;
  requestedByName: string;
  approvedById?: string;
  approvedByName?: string;
  driverId?: string;
  driverName?: string;
  vehicleNo?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Suppliers & Customers ────────────────────────────────
export type ContactType = 'supplier' | 'customer';

export interface Contact {
  id: string;
  type: ContactType;
  nameAr: string;
  nameEn?: string;
  code: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  taxNumber?: string;
  creditLimit?: number;
  paymentTerms?: number;
  isActive: boolean;
  balance?: number;
  totalPurchases?: number;
  totalSales?: number;
  createdAt: string;
}

// ─── Purchase Orders ──────────────────────────────────────
export type OrderStatus = 'draft' | 'pending' | 'approved' | 'partial' | 'completed' | 'cancelled';

export interface PurchaseOrderLine {
  id: string;
  itemId: string;
  item: Item;
  orderedQty: number;
  receivedQty: number;
  unit: ItemUnit;
  unitPrice: number;
  discount?: number;
  taxRate: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  supplier: Contact;
  warehouseId: string;
  warehouse: Warehouse;
  status: OrderStatus;
  orderDate: string;
  expectedDate?: string;
  lines: PurchaseOrderLine[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  notes?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

// ─── Sales Orders ─────────────────────────────────────────
export interface SalesOrderLine {
  id: string;
  itemId: string;
  item: Item;
  qty: number;
  unit: ItemUnit;
  unitPrice: number;
  discount?: number;
  taxRate: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customer: Contact;
  warehouseId: string;
  warehouse: Warehouse;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  lines: SalesOrderLine[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  notes?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

// ─── Employees & HR ───────────────────────────────────────
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface Employee {
  id: string;
  employeeNo: string;
  nameAr: string;
  nameEn?: string;
  role: string;
  department: string;
  warehouseId?: string;
  warehouseName?: string;
  phone: string;
  email?: string;
  hireDate: string;
  salary?: number;
  status: EmployeeStatus;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
  notes?: string;
}

// ─── Fleet ────────────────────────────────────────────────
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';

export interface Vehicle {
  id: string;
  plateNo: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  unit: string;
  driverId?: string;
  driverName?: string;
  status: VehicleStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  mileage?: number;
}

// ─── Audit ────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

// ─── Dashboard ────────────────────────────────────────────
export interface DashboardStats {
  totalItems: number;
  criticalStock: number;
  nearExpiry: number;
  pendingTransfers: number;
  todaySales: number;
  todayPurchases: number;
  presentEmployees: number;
  totalEmployees: number;
  activeWarehouses: number;
}
