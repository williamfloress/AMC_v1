-- CreateEnum
CREATE TYPE "TipoAcabado" AS ENUM ('piso', 'cocina', 'bano');

-- CreateTable
CREATE TABLE "Sector" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acabado" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoAcabado" NOT NULL,
    "nombre" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,

    CONSTRAINT "Acabado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PonderacionAcabado" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoAcabado" NOT NULL,
    "ponderacion" INTEGER NOT NULL,

    CONSTRAINT "PonderacionAcabado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propiedad" (
    "id" SERIAL NOT NULL,
    "sectorId" INTEGER NOT NULL,
    "precio" DECIMAL(14,2) NOT NULL,
    "area_construccion_m2" DECIMAL(10,2) NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "banos" INTEGER NOT NULL,
    "parqueos" INTEGER NOT NULL,
    "acabado_piso_id" INTEGER NOT NULL,
    "acabado_cocina_id" INTEGER NOT NULL,
    "acabado_bano_id" INTEGER NOT NULL,
    "portal" TEXT,
    "cod_publicacion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columna_aux" INTEGER,

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_nombre_key" ON "Sector"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PonderacionAcabado_tipo_key" ON "PonderacionAcabado"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_cod_publicacion_key" ON "Propiedad"("cod_publicacion");

-- CreateIndex
CREATE INDEX "Propiedad_sectorId_idx" ON "Propiedad"("sectorId");

-- CreateIndex
CREATE INDEX "Propiedad_sectorId_area_construccion_m2_idx" ON "Propiedad"("sectorId", "area_construccion_m2");

-- CreateIndex
CREATE INDEX "Propiedad_sectorId_precio_idx" ON "Propiedad"("sectorId", "precio");

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_acabado_piso_id_fkey" FOREIGN KEY ("acabado_piso_id") REFERENCES "Acabado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_acabado_cocina_id_fkey" FOREIGN KEY ("acabado_cocina_id") REFERENCES "Acabado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_acabado_bano_id_fkey" FOREIGN KEY ("acabado_bano_id") REFERENCES "Acabado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
