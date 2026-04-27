-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('DEALER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ISSUED', 'IN_PROGRESS', 'PARTIALLY_RETURNED', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PACKED', 'DISPATCHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'BANK_TRANSFER', 'UPI');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEALER_PAYMENT', 'SUPPLIER_PAYMENT', 'WORKER_PAYMENT', 'DEALER_ADVANCE', 'WORKER_ADVANCE');

-- CreateEnum
CREATE TYPE "RawMaterialUnit" AS ENUM ('KG', 'GRAM', 'PIECE', 'METER', 'DOZEN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MANAGER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_material_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "RawMaterialUnit" NOT NULL DEFAULT 'KG',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_material_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_material_purchases" (
    "id" TEXT NOT NULL,
    "materialTypeId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "costPerUnit" DECIMAL(10,2) NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceNumber" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_material_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplementary_material_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stockQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "supplementary_material_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplementary_issuances" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "supplementary_issuances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "design_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "designCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "material" TEXT,
    "finish" TEXT,
    "diamondCount" INTEGER NOT NULL DEFAULT 0,
    "pieceRateRs" DECIMAL(8,2) NOT NULL,
    "salePricePerDozen" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealer_design_prices" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "pricePerDozen" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealer_design_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parties" (
    "id" TEXT NOT NULL,
    "partyType" "PartyType" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "gstNumber" TEXT,
    "creditLimit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "creditDays" INTEGER NOT NULL DEFAULT 0,
    "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "idProofType" TEXT,
    "idProofNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_assignments" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "rawMaterialTypeId" TEXT NOT NULL,
    "rawMaterialQty" DOUBLE PRECISION NOT NULL,
    "expectedPieces" INTEGER NOT NULL,
    "returnedPieces" INTEGER NOT NULL DEFAULT 0,
    "rejectedPieces" INTEGER NOT NULL DEFAULT 0,
    "pieceRateAtAssignment" DECIMAL(8,2) NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ISSUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedReturnDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_returns" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "piecesReturned" INTEGER NOT NULL,
    "rejectedPieces" INTEGER NOT NULL DEFAULT 0,
    "acceptedPieces" INTEGER NOT NULL,
    "earningAmount" DECIMAL(10,2) NOT NULL,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "goods_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_payments" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "isAdvance" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "worker_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stock" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "unpackagedPieces" INTEGER NOT NULL DEFAULT 0,
    "packagedDozens" INTEGER NOT NULL DEFAULT 0,
    "lowStockAlertAt" INTEGER NOT NULL DEFAULT 5,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaging_batches" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "dozensPackaged" INTEGER NOT NULL,
    "piecesUsed" INTEGER NOT NULL,
    "packedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packedById" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "packaging_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isCreditOrder" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "transportMode" TEXT,
    "trackingRef" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "quantityDozens" INTEGER NOT NULL,
    "pricePerDozen" DECIMAL(10,2) NOT NULL,
    "lineTotal" DECIMAL(12,2) NOT NULL,
    "dispatchedDozens" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL,
    "partyId" TEXT,
    "orderId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "isAdvance" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "recordedById" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_material_issuances" (
    "id" TEXT NOT NULL,
    "materialTypeId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "raw_material_issuances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "raw_material_types_name_key" ON "raw_material_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "supplementary_material_types_name_key" ON "supplementary_material_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "design_categories_name_key" ON "design_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "designs_designCode_key" ON "designs"("designCode");

-- CreateIndex
CREATE UNIQUE INDEX "dealer_design_prices_dealerId_designId_key" ON "dealer_design_prices"("dealerId", "designId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_designId_key" ON "inventory_stock"("designId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "raw_material_issuances_assignmentId_key" ON "raw_material_issuances"("assignmentId");

-- AddForeignKey
ALTER TABLE "raw_material_purchases" ADD CONSTRAINT "raw_material_purchases_materialTypeId_fkey" FOREIGN KEY ("materialTypeId") REFERENCES "raw_material_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_material_purchases" ADD CONSTRAINT "raw_material_purchases_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_material_purchases" ADD CONSTRAINT "raw_material_purchases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplementary_issuances" ADD CONSTRAINT "supplementary_issuances_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "worker_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplementary_issuances" ADD CONSTRAINT "supplementary_issuances_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "supplementary_material_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "design_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealer_design_prices" ADD CONSTRAINT "dealer_design_prices_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealer_design_prices" ADD CONSTRAINT "dealer_design_prices_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_assignments" ADD CONSTRAINT "worker_assignments_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_assignments" ADD CONSTRAINT "worker_assignments_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_assignments" ADD CONSTRAINT "worker_assignments_rawMaterialTypeId_fkey" FOREIGN KEY ("rawMaterialTypeId") REFERENCES "raw_material_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_assignments" ADD CONSTRAINT "worker_assignments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_returns" ADD CONSTRAINT "goods_returns_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "worker_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_payments" ADD CONSTRAINT "worker_payments_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_batches" ADD CONSTRAINT "packaging_batches_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "inventory_stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_batches" ADD CONSTRAINT "packaging_batches_packedById_fkey" FOREIGN KEY ("packedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_material_issuances" ADD CONSTRAINT "raw_material_issuances_materialTypeId_fkey" FOREIGN KEY ("materialTypeId") REFERENCES "raw_material_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_material_issuances" ADD CONSTRAINT "raw_material_issuances_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "worker_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
