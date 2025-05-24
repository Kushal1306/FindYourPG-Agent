import { getGeoCoordinates } from "../helpers/geoCoordinates.js";

export const getGeoDataToIndexPG=async(req,res)=>{
    const {name,address}=req.body;
    try {
        const {place_id,lat,lng,rating}=await getGeoCoordinates(`${name},${address}`);
        res.status(200).json({
            success:true,
            data:{
                place_id,
                lat,
                lng,
                rating
            }
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error:error.message})
    }
}