(function () {
  'use strict';

  angular
  .module('app')
  .controller('CatalogoController', CatalogoController);

  /**@ngInject */
  function CatalogoController(DataService, restUrl, Storage, $stateParams, Message, $location, Documento, $timeout) {
    var vm = this;
    var cuenta = Storage.getUser();
    vm.id_catalogo = $stateParams.idCatalogo;
    vm.data = {
      usuarios: [],
      documentos: []
    };
    vm.usuarios = [];
    vm.dic_estado = {
      'ACTIVO': 'INACTIVO',
      'INACTIVO': 'ACTIVO'
    }
    vm.buscarUsuario = buscarUsuario;
    vm.autorizarUsuario = autorizarUsuario;
    vm.buscarDocumento = buscarDocumento;
    vm.agregarDocumento = agregarDocumento;
    vm.guardarCatalogo = guardarCatalogo;
    iniciar();
    

    function iniciar() {
      inicializarConfiguracionTablas();
      if (vm.id_catalogo == 0) {
        Message.show('INFORMACION', 'No olvide guardar sus cambios, de lo contrario se perderán.');
      }
      else {
        DataService.get(restUrl+'plantillasFormly/catalogo/'+vm.id_catalogo)
        .then(function (resp) {
          if (resp.datos._usuario_creacion != cuenta.id) $location.path('catalogos');
          vm.data = resp.datos;
        });
      }
    }
    function buscarDocumento() {
      
      if (!vm.buscar_documento || vm.buscar_documento == '') Message.show('ADVERTENCIA', 'Escriba el cite del documento a buscar.');
      var datos = {
        cite: vm.buscar_documento
      }
      DataService.post(restUrl+'plantillasFormly/catalogo/documento/', datos)
      .then(function (resp) {
        if (resp) {
          vm.documento = resp.datos;
        }
        else {
          vm.documento = {};
        }
      });
      
    }

    function agregarDocumento() {
      if (!vm.documento || !vm.documento.nombre || !vm.documento.id_documento || !vm.documento.descripcion) {
        Message.show('ERROR', 'Los datos del documento estan incompletos.');
        return;
      }
      vm.documento.estado = 'ACTIVO';
      if (!vm.documento.fid_documento) vm.documento.fid_documento = vm.documento.id_documento;
      vm.data.documentos.push(vm.documento);
      vm.documento = {};
      vm.buscar_documento = null;
    }

    function verDocumento(ev,item) {
      ev.preventDefault();
      Documento.showPdfId(item.fid_documento);
    }

    function cambiarEstadoUsuario(ev, item) {
      ev.preventDefault();
      var datos = {
        fid_catalogo: item.fid_catalogo,
        actualizar: {
          estado: vm.dic_estado[item.estado]
        }
      };
      aplicarCambio(item.id_catalogo_usuario, 'usuario', datos);
    }
    function cambiarEstadoDocumento(ev, item) {
      ev.preventDefault();
      var datos = {
        fid_catalogo: item.fid_catalogo,
        actualizar: {
          estado: vm.dic_estado[item.estado]
        }
      };
      aplicarCambio(item.id_catalogo_documento, 'documento', datos);
    }
    
    function aplicarCambio(id, ruta, datos) {
      DataService.put(restUrl+'plantillasFormly/catalogo/'+ruta+'/'+id, datos)
      .then(function () {
        iniciar();
      });
    }

    function buscarUsuario() {
      if (!vm.buscar_usuario || vm.buscar_usuario == '') return;
      DataService.get(restUrl + 'seguridad/usuario/catalogo?fields=id_usuario,nombres,apellidos,estado&filter=' + vm.buscar_usuario)
      .then(function (resp) {
        filtrarUsuarios(resp.datos.resultado);
      });
    }

    function autorizarUsuario(ev, usuario) {
      if (!usuario.fid_usuario) usuario.fid_usuario = usuario.id_usuario;
      var existe = false;
      if (!vm.data.usuarios) vm.data.usuarios = [];
      vm.data.usuarios.forEach(function (item) {
        if (item.id_usuario == usuario.id_usuario) {
          existe = true;
        }
      });

      if (existe !== true) {
        vm.data.usuarios.push(usuario);
        filtrarUsuarios();
      }
    }

    // FIXME: Verificar el correcto funcionamiento y la logica
    function filtrarUsuarios(usuarios) {
      if (!vm.data.usuarios || vm.data.usuarios.length == 0) {
        vm.usuarios = usuarios? usuarios: [];
        return;
      }
      var lista = vm.usuarios;
      if (usuarios) {
        if (lista.length == 0) lista = usuarios;
        else lista = usuarios;
      }
      var enUso = vm.data.usuarios;
      var listaLimpia = [];
      for (var i = 0; i < lista.length; i++) {
        var usado = false;
        var item = null;
        for (var j = 0; j < enUso.length; j++) {
          item = lista[i];
          if (enUso[j].id_usuario == lista[i].id_usuario) {
            usado = true;
            break;
          }
        }
        if (usado == false && item != null ) {
          listaLimpia.push(item)
        }
      }
      vm.usuarios = listaLimpia;
    }

    function guardarCatalogo() {
      if (vm.id_catalogo == 0) {
        DataService.post(restUrl+'plantillasFormly/catalogo', vm.data)
        .then(function (resp) {
          $timeout(function (){
            $location.path('catalogo/'+resp.datos.id_catalogo);
          }, 300);
        });
      }
      // Actualizar catalogo
      else {
        DataService.put(restUrl+'plantillasFormly/catalogo/'+vm.id_catalogo, vm.data)
        .then(function () {
          iniciar();
        })
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
        },
        {
          field_value: 'estado',
          field_name: 'Estado'
        }
      ]
      vm.botonesDocumentos = [{
          tooltip: 'Ver documento',
          icon: 'remove_red_eye',
          onclick: verDocumento
        },
        // {
        //   tooltip: 'Ver historico',
        //   icon: 'timeline',
        //   onclick: verDocumento
        // },
        {
          tooltip: 'Activar',
          icon: 'done',
          onclick: cambiarEstadoDocumento,
          condition: {
            field: 'estado',
            is: 'INACTIVO'
          }
        },
        {
          tooltip: 'Inactivar',
          icon: 'clear',
          onclick: cambiarEstadoDocumento,
          condition: {
            field: 'estado',
            is: 'ACTIVO'
          }
        }
      ];
      vm.camposUsuarios = [{
          field_value: 'nombres',
          field_name: 'Nombres'
        },
        {
          field_value: 'apellidos',
          field_name: 'Apellidos'
        }, 
        {
          field_value: 'estado',
          field_name: 'Estado'
        }
      ];
      vm.botonesUsuarios = [{
          tooltip: 'Activar',
          icon: 'done',
          onclick: cambiarEstadoUsuario,
          condition: {
            field: 'estado',
            is: 'INACTIVO'
          }
        },
        {
          tooltip: 'Inactivar',
          icon: 'clear',
          onclick: cambiarEstadoUsuario,
          condition: {
            field: 'estado',
            is: 'ACTIVO'
          }
        }
      ];
    }

  }
})();