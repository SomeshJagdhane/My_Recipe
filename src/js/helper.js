import { TIMEOUT_SEC } from "./config.js";
function timeout(sec){
    return new Promise((_,reject)=>{
        setTimeout(()=>{
            reject(new Error(`Request taking too much time, timeout after ${sec} seconds`));
        },sec*1000);
    });
}
export async function getJson(url){
    try{
    const result = await Promise.race([fetch(url),timeout(TIMEOUT_SEC)]);
    const data = await result.json();
    if(!result.ok)throw new Error(`${data.message} ${result.status}`);
    return data;
    }catch(error){
        throw error;
    }
}