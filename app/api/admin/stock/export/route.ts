import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const format = searchParams.get("format") || "csv";

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;

    // Fetch products with variants
    const products = await Product.find(query)
      .populate("brand", "name")
      .populate("category", "name")
      .lean();

    const productIds = products.map((p: any) => p._id);
    const variants = await ProductVariant.find({
      productId: { $in: productIds },
    }).lean();

    // Build export data
    const exportData: any[] = [];

    for (const product of products as any[]) {
      const productVariants = variants.filter(
        (v: any) => v.productId.toString() === product._id.toString()
      );

      // Add base product
      exportData.push({
        Product: product.name,
        SKU: product.sku || "",
        Brand: product.brand?.name || "",
        Category: product.category?.name || "",
        Variant: "Base Product",
        Type: "",
        Stock: product.stock || 0,
      });

      // Add variants
      for (const variant of productVariants as any[]) {
        exportData.push({
          Product: product.name,
          SKU: variant.sku || "",
          Brand: product.brand?.name || "",
          Category: product.category?.name || "",
          Variant: variant.label,
          Type: variant.type,
          Stock: variant.stock || 0,
        });

        // Add packs if exist
        if (variant.packs && variant.packs.length > 0) {
          for (const pack of variant.packs) {
            exportData.push({
              Product: product.name,
              SKU: pack.sku || "",
              Brand: product.brand?.name || "",
              Category: product.category?.name || "",
              Variant: `${variant.label} - ${pack.label}`,
              Type: "Pack",
              Stock: pack.stock || 0,
            });
          }
        }
      }
    }

    // Generate export based on format
    if (format === "csv") {
      const csv = generateCSV(exportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="stock-report-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    } else if (format === "excel") {
      // For Excel, we'll use CSV format with .xlsx extension
      // In production, you'd use a library like 'xlsx' for proper Excel format
      const csv = generateCSV(exportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="stock-report-${
            new Date().toISOString().split("T")[0]
          }.xlsx"`,
        },
      });
    } else if (format === "pdf") {
      // For PDF, we'll generate a simple text-based format
      // In production, you'd use a library like 'jspdf' for proper PDF generation
      const pdf = generatePDF(exportData);
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="stock-report-${
            new Date().toISOString().split("T")[0]
          }.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[v0] Stock export error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to export stock data" },
      { status: 500 }
    );
  }
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

function generatePDF(data: any[]): string {
  // Simple text-based PDF-like format
  // In production, use a proper PDF library
  let content = "STOCK REPORT\n";
  content += `Generated: ${new Date().toLocaleString()}\n\n`;
  content += "=".repeat(80) + "\n\n";

  for (const item of data) {
    content += `Product: ${item.Product}\n`;
    content += `SKU: ${item.SKU}\n`;
    content += `Brand: ${item.Brand}\n`;
    content += `Category: ${item.Category}\n`;
    content += `Variant: ${item.Variant}\n`;
    content += `Type: ${item.Type}\n`;
    content += `Stock: ${item.Stock}\n`;
    content += "-".repeat(80) + "\n";
  }

  return content;
}
