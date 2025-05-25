import prisma from "../prisma/client.js";
import { getGeoCoordinates } from "./geoCoordinates.js";

export const fetchPGsInCity = async (city,sortCondition,limitBy=3) => {
    try {
        const pgList = await prisma.pG.findMany({
            where:{
                city:{
                    equals:city,
                    mode:"insensitive"
                }
            },
            select:{
                name:true,
                address:true,
                city:true,
                state:true,
                pincode:true,
                googleMapsLink:true,
                googleRating:true,
                contactNumber:true,
                email:true,
                foodType:true,
                minPrice:true,
                maxPrice:true,
                coordinates:true,
                amenities:true,
                roomTypes:true,
                terms:true,
                images:true,
                isActive:true,
            },
            orderBy:sortCondition,
            take:limitBy
        });
        return pgList;
    } catch (error) {
        console.log(error);
    }
}

export const findNearestPG=async(placeName)=>{
    try {
        const {lat,lng}=await getGeoCoordinates(placeName);
        console.log(lat,lng);
     
        const pgList = await prisma.pG.aggregateRaw({
                pipeline: [
                  {
                    $geoNear: {
                      near: { type: "Point", coordinates: [lat, lng] },
                      distanceField: "distanceInKm",
                      maxDistance: 50000,  // Increased for testing
                      spherical: true,
                      distanceMultiplier: 0.001
                    }
                  },
                  { $limit: 10 },  // Increased limit
                  {
                    $project: {
                      id: { $toString: "$_id" },
                      name: 1,
                      type: 1,
                      address:1,
                      contactNumber:1,
                      coordinates: 1,
                      minPrice:1,
                      maxPrice:1,
                      images:1,
                      distanceInKm: { $round: ["$distanceInKm", 2] },
                      _id: 0
                    }
                  }
                ]
            });
            
          
          console.log("Nearest PGs:", pgList);
          console.log("The PG List Is",pgList);
          return pgList;
    } catch (error) {
        console.log(error);
    }
    
}
export const getPgDetailsById=async(pgId)=>{
    try {
        const pgDetails=await prisma.pG.findUnique({
            where:{
                id:pgId
            },
            select:{
                name:true,
                address:true,
                city:true,
                state:true,
                pincode:true,
                googleMapsLink:true,
                googleRating:true,
                contactNumber:true,
                email:true,
                foodType:true,
                minPrice:true,
                maxPrice:true,
                amenities:true,
                roomTypes:true,
                terms:true,
                images:true,
                isActive:true,
            }
        });
        return pgDetails;
    } catch (error) {
        console.log(error);
    }
}
export const runquery=async()=>{
    try {
        const result=await prisma.$runCommandRaw({
            createIndexes: "PG",
            indexes: [
              {
                key: { coordinates: "2dsphere" },
                name: "coordinates_2dsphere"
              }
            ]
          });
          console.log(result);
    } catch (error) {
        console.log(error);
        return error;
    }
}
export const fetchAvailableCities=async()=>{
    try {
        const cities=await prisma.pG.findMany({
            select:{
                city:true,
            },
            distinct:["city"]
        });
        return cities;
    } catch (error) {
        console.log(error);
    }
}


export const executeToolCallFunctions=async(name, args) => { 
    console.log("Executing tool:", name, args);
  
    switch (name) {
      // Existing cases...
  
      case "city_tool": {
        const { city } = args;
        console.log(`City selected by user: ${city}`);
        const pgList=await fetchPGsInCity(city);
        // Process as needed
        return {
          success: true,
          message: `✅ City "${city}" selected successfully.`,
          selectedCity: city,
          pgList:pgList
        };
      }
  
      case "find_nearest_pg": {
        const { location } = args;
        console.log(`Finding nearest PG for location: ${location}`);
        const nearestPGs = await findNearestPG(location); 
        return {
          success: true,
          message: `✅ Found ${nearestPGs.length} PGs near "${location}"`,
          pgList: nearestPGs
        };
      }
  
      case "get_offerings_and_details": {
        const { pgId } = args;
        console.log(`Fetching offerings and details for PG ID: ${pgId}`);
        const details = await getPgDetailsById(pgId); // This function should be implemented
        if (!details) {
          return {
            success: false,
            message: `❌ No details found for PG ID: ${pgId}`
          };
        }
        return {
          success: true,
          message: `✅ Retrieved offerings and details for PG ID: ${pgId}`,
          pgDetails: details
        };
      }
  
      case "list_cities": {
        console.log("Fetching list of available cities...");
        const cities = await fetchAvailableCities();
        return {
          success: true,
          message: `✅ Retrieved list of cities`,
          cities
        };
      }
  
      // Keep existing cases...
  
      default:
        return {
          success: false,
          message: `❌ Unknown tool: ${name}`
        };
    }
  }
  