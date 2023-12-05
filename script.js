const r = []
const yPosb = []
const alpha = []
let p = 0
let a = 0
let b = 0
let c = 0

function key(){
    p = parseInt(document.getElementById("p_message").value)
    a = parseInt(document.getElementById("a_message").value)
    b = parseInt(document.getElementById("b_message").value)
    c = parseInt(document.getElementById("c_message").value)
    // let q = document.getElementById("q_message").value
    // let r = document.getElementById("r_message").value

    getQr();
    possibleY();
    findAlpha();
    alert("Key berhasil di generate = " + "("+alpha[1]+")")

    
    
    
    return false
}

function crypto(){
 
     let q = parseInt(document.getElementById("q_message").value)
     let r = parseInt(document.getElementById("r_message").value)
     let inp = String(document.getElementById("input_message").value)
     let pilIndex = parseInt(document.getElementById("Pilmethod").selectedIndex)

    
     
     
     // Encrypt (Format plain text : KAPITAL (tidak ada spasi))
    let hasil = ""
    if(pilIndex == 0){
    let ctext = ""
    for (let index = 0; index < inp.length; index++) { 
        let p1 = parseInt(inp.charCodeAt(index)-65)
        let p2 = 0
        const[f1,f2,f3,f4] = encrypt(p1,p2,alpha[1][0],alpha[1][1],q,r)
        ctext = ctext.concat("{("+f1+","+f2+")" + "," + "(" + f3 + "," + f4 + ")}")
    }
    hasil = ctext
  }

     //Decrypt (Format cipher text : {(y1x,y1y),(y2x,y2y)}{(..,..),(..,..)}..)
     //y1x = 2
     // y1y = 4
     //y2x = 8
     // y2x = 10
     if(pilIndex == 1){
     const yc = []
     let i = 0
     let ptext = ""

     for (let index = 0; index < inp.length; index++) {
        if(parseInt(inp.charAt(index))<=9){
            if(index!=inp.length-1 && parseInt(inp.charAt(index+1))<=9){
                yc[i] = parseInt(inp.charAt(index) + inp.charAt(index+1))
                index++
            }
            else{
                yc[i] = parseInt(inp.charAt(index))
            }
            i++

        }
        else if(inp.charAt(index) == '}'){
            const[t1,t2] = decrypt(yc[0],yc[1],yc[2],yc[3],r)
            ptext = ptext.concat(String.fromCharCode(65+t1))
            i = 0

        }  
        hasil = ptext   
     }
    }
     document.getElementById("hasil_message").innerHTML = hasil    
    return false

}

function getQr(){
    let pangkat = (p-1)/2
    let rtemp = 0
    let index = 0
    for(let i = 1;i<=p-1;i++){
        rtemp = Math.pow(i,pangkat)
        rtemp = rtemp % p
        if(rtemp==1){
            r[index] = i
            index++
        }
    }
}

function possibleY(){
    let index = 0
    let ytemp = 0
    for(let i =1;i<=p-1;i++){
        ytemp = Math.pow(i,2)
        ytemp = ytemp % p 
        for(let j=0;j<r.length;j++){
            if(ytemp == r[j]){
                yPosb[index] = []
                yPosb[index][0] = i
                yPosb[index][1] = ytemp
                index++
                break
            }
        }
    }
    
}

function findAlpha(){
    let index = 0 
    let xTemp = 0
    let xMod = 0

    for(let i=1;i<=p-1;i++){
        xTemp = Math.pow(a*i,3) + b*i+c
        xTemp = xTemp % p
        xMod = xTemp
        xTemp = Math.pow(xTemp,(p-1)/2) % p

        if(xTemp == 1){     
            for(let q = 0;q<yPosb.length;q++){
                   if(yPosb[q][1] == xMod){
                    alpha[index] = []
                    alpha[index][0] = i
                    alpha[index][1] =yPosb[q][0] 
                    index++

                }                
            }
        }

    }
}

function mod(a,p){
    if(a<=0){
        a = a%p
        a = p + (a)
        
    }
    else{
        a = a % p

    }

    return a
}

function invers(a,p){
    let var1 = 0
    let tempp = p
    let var2 = -1
    const alph = []
    const t = []
    t[0] = 0
    t[1] = 1
    let index = 0
    let hasil = 1

    while(var2 !=0){
        var1 = Math.floor(tempp/a)

        var2 = tempp - a*var1
        tempp = a
        a = var2
        alph.push(var1)
        
    }

    while(index<alph.length-1){
        t[index+2] = (t[index]-(alph[index]*t[index+1]))
          t[index+2] = mod(t[index+2],p)
        hasil =  t[index+2]
        index++
    }

   return hasil
}

function lambda(px,py,qx,qy){
    let hasil = 0
    if(px == qx && py == qy){
        hasil = mod(mod((3*(px*px)+a),p) * ((invers(mod(2*py,p),p))),p)
    }

    else{
        hasil = mod(mod((qy-py),p) * invers(mod(qx - px,p),p),p)
       
    }

    return hasil

}

function albelion(px,py,qx,qy,lamb){ 

        let hx = mod(lamb*lamb - px-qx,p)
        let hy = mod(lamb*(px-hx)-py,p)

        return [hx,hy]
    
}

function encrypt(p1,p2,ax,ay,q,r){
    let P = [ax,ay]
    let Q = [ax,ay]
    let lamb = 0
    let i = 1

    while(i<q){
        lamb = lambda(P[0],P[1],Q[0],Q[1])
        const[hx,hy] = albelion(P[0],P[1],Q[0],Q[1],lamb)
        P[0] = hx
        P[1] = hy
        i++
    }

    let y1 = [P[0],P[1]]
    P = [ax,ay]
    i = 1

    while(i<r){
        lamb = lambda(P[0],P[1],Q[0],Q[1])
        const[hx,hy] = albelion(P[0],P[1],Q[0],Q[1],lamb)
        P[0] = hx
        P[1] = hy
        i++
    }

   
    Q = [P[0],P[1]] 
    i = 1

    while(i<q){
        
        lamb = lambda(P[0],P[1],Q[0],Q[1])
        const[hx,hy] = albelion(P[0],P[1],Q[0],Q[1],lamb)
        P[0] = hx
        P[1] = hy

        i++
    }

    

    lamb = lambda(p1,p2,P[0],P[1])
    const[hx,hy] = albelion(p1,p2,P[0],P[1],lamb)
    let y2 = [hx,hy]

    return [y1[0],y1[1],y2[0],y2[1]]

}

function decrypt(y1x,y1y,y2x,y2y,r){
    let P = [y1x,y1y]
    let Q = [y1x,y1y]
    let lamb = 0
    let i = 1
    while(i<r){
        lamb = lambda(P[0],P[1],Q[0],Q[1])
        const[hx,hy] = albelion(P[0],P[1],Q[0],Q[1],lamb)
        P[0] = hx
        P[1] = hy
        i++        
    }
    P[1] = mod(-P[1],p)
    Q = [y2x,y2y]

    lamb = lambda(Q[0],Q[1],P[0],P[1])
    let[hx,hy] = albelion(Q[0],Q[1],P[0],P[1],lamb)
    

    return [hx,hy]
}

/* ------------------------------------------------------------------ MAIN ---------------------------------------------------------------------------------------                                                                       */






