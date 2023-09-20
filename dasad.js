let a=[1,7,3,4,6,1,8]
let b=a.sort((a,b)=>b-a)
console.log(b)
let n=5
let big=[];
for(let i=0;i<n;i++){
    big.push(b[i]);
}
console.log(big);

let sum=big.reduce((acc,curr)=>{
    return acc+curr
},0)
console.log("sum of largest n value is  :  " +sum)