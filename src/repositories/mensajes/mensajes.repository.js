class MensajesRepository {
    constructor( dao ) {
        this.dao = dao;
    }

    async getMensajes() {
        const mensajes = await this.dao.listarAll();
        return mensajes;
    }

    async saveMensaje( mensaje ){
        return await this.dao.guardar( mensaje );
    }
}

module.exports = { MensajesRepository };