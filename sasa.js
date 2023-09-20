let a=[1,2,3,4,44,2,2,1,5,8,9];
let b=[];
for(let i=0;i<a.length;i++){
    for(let j=i+1;j<a.length-1;j++){
        if(a[i]===a[j]){

            b.push(a[i])
        }
    }
}
console.log(b)