export const findNearestPGtool={
    type:"function",
    function:{
    name:"find_nearest_pg",
    description:"Find the nearest PG based on location or place mentioned",
    parameters:{
        type:"object",
        properties:{
            location:{
                type:"string",
                description:"Location or place mentioned by user to find the nearest PG"
            }
        },
        required:["location"]
    }
    }

}