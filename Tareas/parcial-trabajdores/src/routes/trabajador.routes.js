const express = require('express');
const Trabajador = require('../models/Trabajador');

const router = express.Router();

//--GET/TRABAJADOR
router.get('/', async (req, res) => {
    try{
        const trabajadores = await Trabajador.find();

        res.json(trabajadores);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los trabajadores',
            error: error.message
        });
    }

});

//POST /trabajador
router.post('/', async (req, res) => {
    try {
        const nuevoTrabajador = new Trabajador({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            cedula: req.body.cedula,
            cargo: req.body.cargo,
            departamento: req.body.departamento,
            fechaIngreso: req.body.fechaIngreso
        });

        const trabajadorGuardado = await nuevoTrabajador.save();

        res.status(201).json(trabajadorGuardado);

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el trabajador',
            error: error.message
        });
    }
});

// PUT /trabajador/:id
// Actualizar un trabajador
router.put('/:id', async (req, res) => {
    try {
        const trabajadorActualizado = await Trabajador.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                cedula: req.body.cedula,
                cargo: req.body.cargo,
                departamento: req.body.departamento,
                fechaIngreso: req.body.fechaIngreso
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!trabajadorActualizado) {
            return res.status(404).json({
                mensaje: 'Trabajador no encontrado'
            });
        }

        res.json(trabajadorActualizado);

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el trabajador',
            error: error.message
        });
    }
});

// DELETE /trabajador/:id
// Eliminar un trabajador
router.delete('/:id', async (req, res) => {
    try {
        const trabajadorEliminado = await Trabajador.findByIdAndDelete(
            req.params.id
        );

        if (!trabajadorEliminado) {
            return res.status(404).json({
                mensaje: 'Trabajador no encontrado'
            });
        }

        res.json({
            mensaje: 'Trabajador eliminado correctamente',
            trabajador: trabajadorEliminado
        });

    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al eliminar el trabajador',
            error: error.message
        });
    }
});

module.exports = router;

