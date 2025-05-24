
import dotenv from "dotenv";
dotenv.config();

export const getGeoCoordinates = async (place,normalAPI=false) => {
    try {
        const apiKey=process.env.GOOGLE_API_KEY;
        console.log(apiKey);
        const encodedPlace=encodeURIComponent(place);
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPlace}&key=${apiKey}`);
        console.log(response);
        const data = await response.json();
        const {lat,lng}=data.results[0].geometry.location;
        
        if(!normalAPI){
            return {lat,lng}
        }

        return {
            place_id:data.results[0].place_id,
            lat,
            lng,
            rating:data.results[0].rating
        }
        
    } catch (error) {
        console.log(error);
        return null;
    }
}