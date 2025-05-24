export const cityTool={
    type:"function",
    function:{
    name:"city_tool",
    description:"City Selected by User among the list of cities",
    parameters:{
        type:"object",
        properties:{
            city:{
                type:"string",
                description:"City Selected by User"
            }
        },
        required:["city"]
    }
    }
}
    