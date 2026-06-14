// ( function ( wp, React ) {
//   var el = React.createElement;
//   var registerPlugin = wp.plugins.registerPlugin;
//   var PluginSidebar = wp.editor.PluginSidebar;

//   registerPlugin( 'my-plugin-sidebar', {
//       render: function () {
//           return el(
//               PluginSidebar,
//               {
//                   name: 'my-plugin-sidebar',
//                   icon: 'admin-post',
//                   title: 'My plugin sidebar',
//               },
//               'Meta field'
//           );
//       },
//   } );
// } )( window.wp, window.React );
// ( function ( wp ) {
//   var el = React.createElement;
//   var registerPlugin = wp.plugins.registerPlugin;
//   var PluginSidebar = wp.editor.PluginSidebar;
//   var TextControl = wp.components.TextControl;

//   registerPlugin( 'my-plugin-sidebar', {
//       render: function () {
//           return el(
//               PluginSidebar,
//               {
//                   name: 'my-plugin-sidebar',
//                   icon: 'admin-post',
//                   title: 'My plugin sidebar',
//               },
//               el(
//                   'div',
//                   { className: 'plugin-sidebar-content' },
//                   el( TextControl, {
//                       label: 'Meta Block Field',
//                       value: 'Initial value',
//                       onChange: function ( content ) {
//                           console.log( 'content changed to ', content );
//                       },
//                   } )
//               )
//           );
//       },
//   } );
// })(window.wp);
// ( function ( wp ) {
//   var el = React.createElement;
//   var registerPlugin = wp.plugins.registerPlugin;
//   var PluginSidebar = wp.editor.PluginSidebar;
//   var TextControl = wp.components.TextControl;

//   var MetaBlockField = function () {
//       return el( TextControl, {
//           label: 'Meta Block Field',
//           value: 'Initial value',
//           onChange: function ( content ) {
//               console.log( 'content changed to ', content );
//           },
//       } );
//   };

//   registerPlugin( 'my-plugin-sidebar', {
//       render: function () {
//           return el(
//               PluginSidebar,
//               {
//                   name: 'my-plugin-sidebar',
//                   icon: 'admin-post',
//                   title: 'My plugin sidebar',
//               },
//               el(
//                   'div',
//                   { className: 'plugin-sidebar-content' },
//                   el( MetaBlockField )
//               )
//           );
//       },
//   } );
// } )( window.wp );
( function ( wp ) {
  var el = React.createElement;
  var registerPlugin = wp.plugins.registerPlugin;
  var PluginSidebar = wp.editor.PluginSidebar;
  var Text = wp.components.TextControl;
  var useSelect = wp.data.useSelect;

  var MetaBlockField = function () {
      var metaFieldValue = useSelect( function ( select ) {
          return select( 'core/editor' ).getEditedPostAttribute(
              'meta'
          )[ 'sidebar_plugin_meta_block_field' ];
      }, [] );

      return el( Text, {
          label: 'Meta Block Field',
          value: metaFieldValue,
          onChange: function ( content ) {
              console.log( 'content has changed to ', content );
          },
      } );
  };

  registerPlugin( 'my-plugin-sidebar', {
      render: function () {
          return el(
              PluginSidebar,
              {
                  name: 'my-plugin-sidebar',
                  icon: 'admin-post',
                  title: 'My plugin sidebar',
              },
              el(
                  'div',
                  { className: 'plugin-sidebar-content' },
                  el( MetaBlockField )
              )
          );
      },
  } );
})(window.wp);    
wp.data
  .dispatch('core/editor')
  .editPost({ meta: { sidebar_plugin_meta_block_field: 'hello world!' } });
