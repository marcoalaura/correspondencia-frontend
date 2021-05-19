
(function () {
  'use strict';

  angular
    .module('app')
    .controller('CompartidoController', CompartidoController);

  /**@ngInject */
  function CompartidoController(DataService, restUrl, Storage, $stateParams, Message, $location, Documento) {
    var vm = this;
    var cuenta = Storage.getUser();
    vm.id_catalogo = $stateParams.idCompartido;
    vm.data = {
      usuarios: [],
      documentos: []
    };

    iniciar();

    function iniciar() {
      inicializarConfiguracionTablas();
      if (vm.id_catalogo == 0) {
        Message.show('ERROR', 'Identificador no valido.');
        $location.path('compartidos')
      } else {
        DataService.get(restUrl + 'plantillasFormly/catalogo/' + vm.id_catalogo+'?filter=true')
        .then(function (resp) {
          if (!resp) {
            Message.show('ERROR', 'El catalogo no pudo ser encontrado.');
            $location.path('compartidos');
          }
          var esValido = false;
          for (var i = 0; i < resp.datos.usuarios.length; i++) {
            var usuario = resp.datos.usuarios[i];
            if (usuario.fid_usuario == cuenta.id) {
              esValido = true
            }
          }
          if (esValido == false) {
            Message.show('ERROR', 'Usted no se encuentra autorizado para ver este catalogo.');
            $location.path('compartidos');
          }
          vm.data = resp.datos;
        });
      }
    }

    /**
     * Inicializa las cabeceras de las tablas y la configuracion de los botones de acción
     * las tablas son de documentos y usuarios
     * @returns Un vector de objetos
     */
    function inicializarConfiguracionTablas() {
      vm.camposDocumentos = [{
          field_value: 'nombre',
          field_name: 'Documento'
        },
        {
          field_value: 'descripcion',
          field_name: 'Descripción'
        }
      ]
      vm.botonesDocumentos = [{
        tooltip: 'Ver documento',
        icon: 'remove_red_eye',
        onclick: verDocumento
      }
      ];
      vm.camposUsuarios = [
        {
          field_value: 'nombres',
          field_name: 'Nombres'
        },
        {
          field_value: 'apellidos',
          field_name: 'Apellidos'
        }
      ];
      vm.botonesUsuarios = [];
    }

    function verDocumento(ev, item) {
      ev.preventDefault();
      Documento.showPdfId(item.fid_documento);
    }


  }
})();