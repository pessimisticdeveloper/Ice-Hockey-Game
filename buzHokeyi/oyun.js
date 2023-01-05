const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

//dikdörtgen dizimi arkaplan
const drawRect = (x,y,w,h,color) => {
    context.fillStyle = color
    context.fillRect(x,y,w,h)
}

//daire cizimi
const drawCircleF = (x,y,r,color) =>{
    context.fillStyle = color
    context.beginPath()
    context.arc(x,y,r,0,2 * Math.PI,false)
    context.closePath()
    context.fill()
}

//içi boş daire
const drawCircleS = (x,y,r,w,color) =>{
    context.strokeStyle = color
    context.lineWidth = w
    context.beginPath()
    context.arc(x,y,r,0,2 * Math.PI)
    context.closePath()
    context.stroke()
}

//skor yazdırmak için
const drawText = (text,x,y,color) =>{
    context.fillStyle = color
    context.font = '50px sans-serif'
    context.fillText(text,x,y)
}

//kullanıcı bilgileri (oyuncu)
const user = {
    x: 10,
    y: canvas.height/2 - 50,
    w: 20,
    h: 150,
    color: '#F61010',
    skor: 0
}

//bilgisayar için
const com = {
    x: canvas.width - 30,
    y: canvas.height/2 -50,
    w: 20,
    h: 150,
    color: '#0F2EF9',
    skor: 0
}

//top görseli
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    r: 20,
    color: '#19E2F0',
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true
}

//hareket sistemi
const movePaddle = (e) => {
    let rect = canvas.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.h/2
    ball.stop = false
}

canvas.addEventListener('mousemove',movePaddle)

const collision = (b,p) => {
    b.top = b.y - b.r
    b.bottom = b.y + b.r
    b.left = b.x - b.r
    b.right = b.x + b.r

    p.top = p.y
    p.bottom = p.y + p.h
    p.left = p.x 
    p.right = p.x + p.w

    return(b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left)

}

const resetBall = () =>{
    ball.x = canvas.width/2
    ball.y = canvas.height/2

    ball.speed = 5
    ball.velocityX = 3
    ball.velocityY = 4
    ball.stop = true
}

//top hareketi için 
const update = () =>{
    if(!ball.stop){
        ball.x += ball.velocityX
        ball.y += ball.velocityY
    }

    //top sahanın içinde kalması için
    if(ball.y + ball.r > canvas.height || ball.y - ball.r < 0)
        ball.velocityY = -ball.velocityY

    let comlevel = 0.1 //oyun seviyesi
    com.y += (ball.y - (com.y + com.h/2)) * comlevel

    let player = (ball.x < canvas.width/2) ? user : com
    if(collision(ball,player)){
        let intersectY = ball.y - (player.y + player.h/2)
        intersectY /= player.h/2

        let maxBounceRate = Math.PI / 3 
        let bounceAngle = intersectY * maxBounceRate

        let direction = (ball.x < canvas.width/2) ? 1 : -1

        ball.velocityX = direction * ball.speed * Math.cos(bounceAngle)
        ball.velocityY = ball.speed * Math.sin(bounceAngle)

        ball.speed += 2
    }
     if(ball.x > canvas.width){
        user.skor++
        resetBall()
     }else if(ball.x < 0){
        com.skor++
        resetBall()
     }

}

//oyun Görseli
const render = () =>{
    drawRect(0,0,canvas.width,canvas.height,'#17C117') //arka plan 
    drawRect(canvas.width/2 - 2,0,4,canvas.height,'#fff') // orta çizgi
    drawCircleF(canvas.width/2,canvas.height/2,15,'#fff') //başlama noktası
    drawCircleS(canvas.width/2,canvas.height/2,70,5,'#fff') //ortasaha 
    drawText(user.skor,canvas.width/4,40,'#F61010')//user skor 
    drawText(com.skor,3*canvas.width/4,40,'#0F2EF9')//bilgisayar skor 

    drawRect(user.x,user.y,user.w,user.h,user.color)//oyuncu raketi
    drawRect(com.x,com.y,com.w,com.h,com.color) //bilgisayarın oyuncu raketi
    drawCircleF(ball.x,ball.y,ball.r,ball.color)//top çizimi

   

}

//oyun içeriklerini yönetme
const game = () => {
    update()
    render()
}

const fps = 50 //fps tanımlama 50 kare olacak
setInterval(game,1000/fps)


