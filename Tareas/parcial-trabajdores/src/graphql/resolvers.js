const Trabajador = require('../models/Trabajador');

const resolvers = {

    Query: {

        obtenerTrabajadores: async () => {
            return await Trabajador.find();
        },

        obtenerTrabajador: async (_, args) => {
            return await Trabajador.findById(args.id);
        }
    },

    Mutation: {

        crearTrabajador: async (_, { input }) => {
            const nuevoTrabajador = new Trabajador({
                nombre: input.nombre,
                apellido: input.apellido,
                cedula: input.cedula,
                cargo: input.cargo,
                departamento: input.departamento,
                fechaIngreso: input.fechaIngreso
            });

            return await nuevoTrabajador.save();
        },

        actualizarTrabajador: async (_, { id, input }) => {
            return await Trabajador.findByIdAndUpdate(
                id,
                {
                    nombre: input.nombre,
                    apellido: input.apellido,
                    cedula: input.cedula,
                    cargo: input.cargo,
                    departamento: input.departamento,
                    fechaIngreso: input.fechaIngreso
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        },

        eliminarTrabajador: async (_, { id }) => {
            return await Trabajador.findByIdAndDelete(id);
        }
    }
};

module.exports = resolvers;