export const getPgOfferingsAndDetailsTool={
    type:"function",
    function:{
        name:"get_offerings_and_details",
        description:"Get offerings and details of PG based on PG ID",
        parameters:{
            type:"object",
            properties:{
                pgId:{
                    type:"string",
                    description:"PG ID"
                }
            },
            required:["pgId"]
        }
    }
}