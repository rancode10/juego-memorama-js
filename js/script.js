class Memorama {

    constructor() {
        
        this.totalTarjetas = [];
        this.numeroTarjetas = 0;
        this.verificadorTarjetas = [];
        this.errores = 0;
        this.nivelDifivultad = '';
        this.imagenesCorrectas = [];
        this.agregadorTarjetas = [];

        this.$contenedorGeneral = document.querySelector('.contenedor-general');
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
        this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada')
        this.$mensaje = document.querySelector('h2.mensaje');     
        this.$errorContenedor = document.createElement('div') ;  

        //Llamado a los eventos
        this.eventos();
    }

    eventos() {
        window.addEventListener('DOMContentLoaded', () => {
            this.cargaPantalla();

        });
    }

    async cargaPantalla() {
        const respuesta = await fetch('../memo.json');        
        const data = await respuesta.json();
        this.totalTarjetas = data;
        if(this.totalTarjetas.length > 0) {
            this.totalTarjetas.sort(orden);
            function orden(a,b) {
                return Math.random() - 0.5;
            }
        }
        
        this.numeroTarjetas = this.totalTarjetas.length;

        let html = '';
        this.totalTarjetas.forEach(card => {
            html += `<div class="tarjeta">
                        <img class="tarjeta-img" src=${card.src} alt="imagen memorama">
                    </div>`
        });

        this.$contenedorTarjetas.innerHTML = html; 
        this.comienzaJuego();  
        this.contenedorError();     
    }

    comienzaJuego() {
        const tarjetas = document.querySelectorAll('.tarjeta');
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', e => {
                this.clickTarjeta(e);
            })
        });
    }

    clickTarjeta(e) {
        this.efectoVoltearTarjeta(e);

        let sourceImage = e.target.childNodes[1].attributes[1].value;
        this.verificadorTarjetas.push(sourceImage);

        let tarjeta = e.target;        
        this.agregadorTarjetas.unshift(tarjeta);
        this.comparadorTarjetas();
    }

    efectoVoltearTarjeta(e) {
        e.target.style.backgroundImage = 'none';
        e.target.style.backgroundColor = 'white';
        e.target.childNodes[1].style.display = 'block';
    }

    fijarParAcertado(arrtarjetasAceptadas) {
        arrtarjetasAceptadas.forEach(tarjeta => {
            tarjeta.classList.add('acertada');
            this.imagenesCorrectas.push(tarjeta);
            this.victoriaJuego();
        });
    }

    reversoTarjetas(arrTarjetas) {
        arrTarjetas.forEach(tarjeta => {
            setTimeout(() => {
                tarjeta.style.backgroundImage = 'url(../img/cover.jpg)';
                tarjeta.childNodes[1].style.display = 'none';
            }, 1000);
        })
    }

    comparadorTarjetas() {  
        if(this.verificadorTarjetas.length == 2) {
            if(this.verificadorTarjetas[0] === this.verificadorTarjetas[1]){
                this.fijarParAcertado(this.agregadorTarjetas);
            } else {
                this.reversoTarjetas(this.agregadorTarjetas);
                this.errores++;
                this.incrementadorError();
                this.derrotaJuego();
            }
            this.verificadorTarjetas.splice(0); //liberador de arreglo, usando splice
            this.agregadorTarjetas.splice(0); // liberador de arreglo, usando splice
        }
    }

    victoriaJuego() {
        if(this.imagenesCorrectas.length === this.numeroTarjetas) {
            setTimeout(() => {
                this.$pantallaBloqueada.style.display = 'block';
                this.$mensaje.innerText = '¡Felicidades! has ganado el juego'
            }, 1000);
            setTimeout(() => {
                location.reload();
            }, 4000);
        }
    }

    derrotaJuego() {
        if(this.errores === 5) {
            setTimeout(() => {
               this.$pantallaBloqueada.style.display = 'block';                
            }, 0);
            setTimeout(() => {
                location.reload();   
            }, 4000);
        }
    }

    incrementadorError() {
        this.$errorContenedor.innerText = `Errores: ${this.errores}`
    }

    contenedorError() {
        this.$errorContenedor.classList.add('error');
        this.incrementadorError();
        this.$contenedorGeneral.appendChild(this.$errorContenedor);
    }
}

new Memorama();

//minuto 6:46 video 4