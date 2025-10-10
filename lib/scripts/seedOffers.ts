import dbConnect from "../../lib/db/db";
import Offer from "../../lib/models/Offer";

async function seedOffers() {
  try {
    await dbConnect();

    // Clear existing offers
    await Offer.deleteMany({});

    const offers = [
      {
        name: "Welcome Offer - 10% Off",
        couponCode: "WELCOME10",
        type: "percentage",
        value: 10,
        status: "active",
        description: "Get 10% off on your first order",
        minCartValue: 500,
        maxDiscount: 200,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 1000,
        usageCount: 0,
        perUserLimit: 1,
      },
      {
        name: "Flat ₹200 Off",
        couponCode: "SAVE200",
        type: "amount",
        value: 200,
        status: "active",
        description: "Get flat ₹200 off on orders above ₹1000",
        minCartValue: 1000,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usageLimit: 500,
        usageCount: 0,
      },
      {
        name: "Weekend Special - 15% Off",
        couponCode: "WEEKEND15",
        type: "percentage",
        value: 15,
        status: "active",
        description: "Weekend special! Get 15% off on all products",
        minCartValue: 800,
        maxDiscount: 500,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        usageLimit: 200,
        usageCount: 0,
      },
      {
        name: "Mega Sale - ₹500 Off",
        couponCode: "MEGA500",
        type: "amount",
        value: 500,
        status: "active",
        description: "Mega sale! Get ₹500 off on orders above ₹2000",
        minCartValue: 2000,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        usageLimit: 100,
        usageCount: 0,
      },
      {
        name: "Buy 1 Get 2 Free",
        couponCode: "BUY1GET2",
        type: "percentage",
        value: 0,
        status: "active",
        description: "Buy 1 product and get 2 products absolutely free!",
        minCartValue: 500,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        buyXGetY: {
          enabled: true,
          buyQuantity: 1,
          getQuantity: 2,
        },
        usageLimit: 300,
        usageCount: 0,
        perUserLimit: 2,
      },
      {
        name: "Flash Sale - 25% Off",
        couponCode: "FLASH25",
        type: "percentage",
        value: 25,
        status: "active",
        description: "Flash sale! Limited time offer - 25% off",
        minCartValue: 1500,
        maxDiscount: 1000,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        usageLimit: 50,
        usageCount: 0,
      },
    ];

    const createdOffers = await Offer.insertMany(offers);
    console.log(`✅ Successfully seeded ${createdOffers.length} offers`);
    console.log("\nCreated offers:");
    createdOffers.forEach((offer) => {
      console.log(`- ${offer.name} (${offer.couponCode})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding offers:", error);
    process.exit(1);
  }
}

seedOffers();
