function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}
//Função BORDAS DA BARREIRA CRIAÇÃO(barreiras, goku e gohan.gif animação css)
function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
//METODOS PARA APLICAÇÃO DA BARREIRA, CASO SEJA FALSE INICIAR COMANDOS ABAIXO.
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
//AQUI ABAIXO DEFININDO A ALTURA DO GOKU (NUVEMVOADORA)
    this.setAltura = altura => corpo.style.height = `${altura}px`

}


//FUNÇÃO CRIAÇÃO DE BARREIRA SUPERIOR E INFERIOR(BARREIAS COM GIF (GOKUEGOHAN))
//VALE DESTACAR QUE TODA ESTRUTURA ESTA SENDO CRIADA VIA JAVASCRIPT (COMANDO PARA CRIAÇÃO DA ANIMAÇÃO E ESTRUTURA)
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
//FUNÇÃO RESPONSAVEL PELA ABERTURA DA PASSAGEM DO GOKU/NUVEMVOADORA
//METODO RANDOM, DE FORMA ALERTORIA.
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

///FUNÇÃO RESPONSAVEL PARA COMPUTAR ALTURA,ABERTURA,ESPAÇO E NOTIFICAÇÃO DA PONTUAÇÃO APOS PASSAGEM NOS OBSTACULOS.
function Barreiras(altura, largura, abertura, espaco, notificarPontuacao) {
    this.pares = [
            new ParDeBarreiras(altura, abertura, largura),
            new ParDeBarreiras(altura, abertura, largura + espaco),
            new ParDeBarreiras(altura, abertura, largura + espaco * 2),
            new ParDeBarreiras(altura, abertura, largura + espaco * 3)

        ]
        //DESLOCAMENTO GOKU NUVEM VOADORA
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)
                //quando elemento barreira sair da area do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >=
                meio && par.getX() < meio
            if (cruzouMeio) notificarPontuacao()
        })

    }
}


//CRIAÇÃO DO  DO GOKU(ESTILOS,HTML E MOVIMENTAÇOES)
function SonGoku(alturaJogo) {
    let voando = false
    this.elemento = novoElemento('img', 'gokunuvem')
    this.elemento.src = '/imagens/gokunuvens.gif'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
        //abaixo verificação da area do jogo(DRAGON BALL)
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const AlturaMaxima = alturaJogo - this.elemento.clientHeight
        if (novoY <= 0) {
            this.setY(0)

        } else if (novoY >= AlturaMaxima) {
            this.setY(AlturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

//abaixo função progresso do jogo (pontuação)

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}
//função abaixo que ira determinar a colisão
//vamos verificar sobreposições entre os elementos da barreira
//metodo Bounding ira passar todas dimensoes do elemento
function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left &&
        b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top &&
        b.top + b.height >= a.top
    return horizontal && vertical
}
//função colidir goku com barreira(gokuegohan-gif)
//RESPONSAVEL POR YOU-LOSE(COLIDIU PERDEU,RSRSRS)
function colidiu(gokunuvem, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreiras => {
        if (!colidiu) {
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(gokunuvem.elemento, superior) ||
                estaoSobrepostos(gokunuvem.elemento, inferior)
        }
    })
    return colidiu
}

//FUNÇÃO QUE IRA UNIFICAR TODOS OS METODOS, PONTUAÇÃO,ANIMAÇÃO,PROGRESSO,ALTURA.
function DbzGoku() {
    let pontos = 0
    const areaDoJogo = document.querySelector('[area-goku-dbz]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 300, 400,
        () => progresso.atualizarPontos(++pontos))
    const gokunuvem = new SonGoku(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(gokunuvem.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        //loop do jogo em temporizador
        const temporizador = setInterval(() => {
            barreiras.animar()
            gokunuvem.animar()

            if (colidiu(gokunuvem, barreiras)) {
                clearInterval(temporizador)
            }

        }, 20)
    }
}

new DbzGoku().start()

//MEU PRIMEIRO PROJETO EM JAVASCRIPT PURO,HTML E CSS.