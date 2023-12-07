
export async function getJson(url){
    try{
    const result = await fetch(url);
    const data = await result.json();
    return data;
    }catch(error){
        throw error;
    }
}