
import prisma from "../prisma/client.js";
export const postPG = async (req, res) => {
    try {
        const {
            name,
            type,
            address,
            city,
            state,
            pincode,
            contactNumber,
            email,
            description = '',
            websiteLink = '',
            foodType,
            minPrice,
            maxPrice,
            amenities = [],
            roomTypes = [],
            terms = [],
            images = [],
            googleMapsLink,
            googleRating,
            coordinates,
            isActive = true
        } = req.body;

        const pg = await prisma.pG.create({
            data: {
                name,
                type,
                address,
                city,
                state,
                pincode,
                contactNumber,
                email,
                description,
                websiteLink,
                foodType,
                minPrice: parseFloat(minPrice),
                maxPrice: parseFloat(maxPrice),
                amenities,
                roomTypes:roomTypes.map(room => ({
                        name: room.name,
                        capacity: parseFloat(room.capacity),
                        pricePerMonth: parseFloat(room.pricePerMonth),
                        securityDeposit: parseFloat(room.securityDeposit || 0),
                        description: room.description || '',
                        isAcAvailable: Boolean(room.isAcAvailable),
                        attachedBathroom: Boolean(room.attachedBathroom),
                        isAvailable: room.isAvailable !== false, // default to true if not specified
                        amenities: Array.isArray(room.amenities) ? room.amenities : []
                    }))
                ,
                terms,
                images,
                googleMapsLink,
                googleRating: googleRating ? parseFloat(googleRating) : 0.00,
                coordinates,
                isActive,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        console.log(pg);

        if(!pg){
            return res.status(500).json({success:false,error:"Failed to index PG"})
        }

        return res.status(201).json({
            success: true,
            message: "PG Indexed Successfully"
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message })
    }
}
