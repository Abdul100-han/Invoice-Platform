import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Abdulslam Muhammad",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "abdulmuhd857@gmail.com" }],
      template_uuid: "62cf863e-ff38-49dd-ab04-0808b4cdbfd7",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "AbdulInvoiceApp",
        company_info_address: "C1 Abdullahi wase road",
        company_info_city: "Kano",
        company_info_zip_code: "345345",
        company_info_country: "Nigeria",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}