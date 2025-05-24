import prisma from "../prisma/client.js";

const dummyPGs=[
    {
      name: "Koliving Newtown PG PG in Newtown",
      type: "MALE",
      description: "Comfortable and affordable PG for working professionals and students located in the heart of Newtown, Kolkata.",
      address: "Premises no. 05, Block no. CE, Land, CE/1B/49, Street Number 222, CE Block (Newtown), Action Area 1C, Newtown, Kolkata, West Bengal 700156",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700156",
      googleMapsLink: "https://maps.google.com/?q=22.5750623,88.4574087",
      googleRating: 4.2,
      websiteLink: "https://koliving.in/",
      contactNumber: "08100875623",
      email: "info@koliving.in",
      foodType: "VEG",
      isActive: true,
      minPrice: 11000,
      maxPrice: 14000,
      coordinates: [22.5750623, 88.4574087], 
      amenities: ["washing machine", "ac", "geyser", "food", "wifi"],
      roomTypes: [
        {
          name: "Single",
          capacity: 1,
          pricePerMonth: 14000,
          securityDeposit: 4000,
          description: "Private single room with all modern amenities.",
          amenities: ["ac", "geyser", "wifi"],
          isAcAvailable: true,
          attachedBathroom: true,
          isAvailable: true
        },
        {
          name: "Double",
          capacity: 2,
          pricePerMonth: 13000,
          securityDeposit: 4000,
          description: "Spacious double sharing room.",
          amenities: ["ac", "geyser", "wifi"],
          isAcAvailable: true,
          attachedBathroom: true,
          isAvailable: true
        },
        {
          name: "Triple",
          capacity: 3,
          pricePerMonth: 11000,
          securityDeposit: 3000,
          description: "Affordable triple sharing room with attached bathroom.",
          amenities: ["geyser", "wifi"],
          isAcAvailable: false,
          attachedBathroom: true,
          isAvailable: true
        }
      ],
      terms: [
        "Rent to be paid by 5th of every month.",
        "No smoking or alcohol inside the premises.",
        "Visitors not allowed after 10 PM.",
        "Minimum stay of 3 months required."
      ],
      images: [
        "https://koliving.in/wp-content/uploads/2023/06/Artboard-9-100-s.png"
      ]
    },
  
    {
      name: "GreenNest PG Boys PG in Salt Lake",
      type: "MALE",
      description: "Peaceful PG with daily cleaning and vegetarian meals in Sector 5, Salt Lake.",
      address: "Plot 23, Street No. 104, EC Block, Sector V, Salt Lake City, Kolkata, West Bengal 700091",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      googleMapsLink: "https://maps.google.com/?q=22.576946,88.431107",
      googleRating: 4.0,
      websiteLink: "https://greennestpg.com/",
      contactNumber: "08956432100",
      email: "info@greennestpg.com",
      foodType: "VEG",
      isActive: true,
      minPrice: 9500,
      maxPrice: 13000,
      coordinates: [22.5750623, 88.4474087],
      amenities: ["wifi", "food", "washing machine", "geyser"],
      roomTypes: [
        {
          name: "Single",
          capacity: 1,
          pricePerMonth: 13000,
          securityDeposit: 3000,
          description: "Well-furnished single room with balcony and attached bath.",
          amenities: ["geyser", "wifi"],
          isAcAvailable: false,
          attachedBathroom: true,
          isAvailable: true
        },
        {
          name: "Double",
          capacity: 2,
          pricePerMonth: 11500,
          securityDeposit: 3000,
          description: "Spacious double room with attached toilet.",
          amenities: ["wifi", "geyser"],
          isAcAvailable: true,
          attachedBathroom: true,
          isAvailable: true
        }
      ],
      terms: [
        "Rent due on 1st of each month.",
        "No guests allowed overnight.",
        "Minimum 2 months stay required."
      ],
      images: [
        "https://koliving.in/wp-content/uploads/2023/06/Artboard-9-100-s.png"
      ]
    },
  
    {
      name: "Metro Stay PG PG Near City Center 2",
      type: "FEMALE",
      description: "PG with peaceful environment and easy access to malls and transport.",
      address: "Building No. 7, HIG-19, Street 87, City Center 2, Newtown, Kolkata, West Bengal 700157",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700157",
      googleMapsLink: "https://maps.google.com/?q=22.6053,88.4621",
      googleRating: 4.3,
      websiteLink: "https://metrostaypg.in/",
      contactNumber: "09012234567",
      email: "contact@metrostaypg.in",
      foodType: "NON_VEG",
      isActive: true,
      minPrice: 10000,
      maxPrice: 13500,
      coordinates: [22.6053, 88.4494087],
      amenities: ["wifi", "geyser", "ac", "washing machine", "food"],
      roomTypes: [
        {
          name: "Double",
          capacity: 2,
          pricePerMonth: 12000,
          securityDeposit:12000,
          description: "Airy double occupancy with city view.",
          amenities: ["ac", "geyser"],
          isAcAvailable: true,
          attachedBathroom: true,
          isAvailable: true
        },
        {
          name: "Triple",
          capacity: 3,
          pricePerMonth: 11000,
          securityDeposit: 11000,
          description: "Affordable triple room ideal for students.",
          amenities: ["wifi"],
          isAcAvailable: false,
          attachedBathroom: true,
          isAvailable: true
        }
      ],
      terms: [
        "Rent must be paid by 3rd of every month.",
        "ID proof mandatory at check-in.",
        "Electricity extra based on usage."
      ],
      images: [
        "https://koliving.in/wp-content/uploads/2023/06/Artboard-9-100-s.png"
      ]
    },
  
    {
      name: "UrbanNest PG PG near Biswa Bangla Gate",
      type: "CO_LIVING",
      description: "Clean and modern PG with rooftop garden and high-speed internet.",
      address: "Plot 89, Street No. 300, Biswa Bangla Road, Action Area IIC, Newtown, Kolkata, West Bengal 700135",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700135",
      googleMapsLink: "https://maps.google.com/?q=22.5921,88.4723",
      googleRating: 4.1,
      websiteLink: "https://urbannestpg.in/",
      contactNumber: "09876543210",
      email: "support@urbannestpg.in",
      foodType: "VEG",
      isActive: true,
      minPrice: 10500,
      maxPrice: 14000,
      coordinates: [22.5921, 88.4464087],
      amenities: ["wifi", "food", "washing machine", "geyser", "ac"],
      roomTypes: [
        {
          name: "Single",
          capacity: 1,
          pricePerMonth: 14000,
          securityDeposit: 4000,
          description: "Stylish single room with city view and bath.",
          amenities: ["wifi", "ac", "geyser"],
          isAcAvailable: true,
          attachedBathroom: true,
          isAvailable: true
        },
        {
          name: "Triple",
          capacity: 3,
          pricePerMonth: 10500,
          securityDeposit: 3000,
          description: "Triple sharing with ample storage space.",
          amenities: ["wifi", "geyser"],
          isAcAvailable: false,
          attachedBathroom: true,
          isAvailable: true
        }
      ],
      terms: [
        "Only vegetarian food allowed.",
        "Early exit requires 1-month notice.",
        "Rent includes food and wifi."
      ],
      images: [
        "https://koliving.in/wp-content/uploads/2023/06/Artboard-9-100-s.png"
      ]
    }
  ];
export const runDummyPGQuery=async()=>{
    try {

        const dummyData=await prisma.pG.createMany({
            data:dummyPGs
        });
        console.log(dummyData);
    } catch (error) {
        console.log(error);
    }
}