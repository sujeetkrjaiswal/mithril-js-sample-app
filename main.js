(function () {
  var root = document.body
  /**
   * The below code generate the dummy data
   * for the application. It is wrapped inside
   * a closure, to avoid any variable leakage.
   * 
   * It accepts number of entries to generate
   */
  var sampleData = (function (size) {
    var data = []
    for (var i = 0; i < size; i++) {
      data.push({
        sn: i + 1,
        Locn_Nbr: Math.ceil(Math.random() * 100000),
        Online_Ord_Id: 0,
        KSN_Id: 0,
        SKU_Pre_Type_Cd: 0
      })
    }
    return data
  }(1000000))


  // Mithril Components

  /**
   * This component takes the data as input and 
   * just displays the table
   */
  var DataList = {
    view: function (vnode) {
      var headClass = "fw6 ba b--black-20 tl pv3 ph3 bg-white tc"
      var rowClass = "pv3 ph3 ba b--black-20"
      var tableClass = "f6 w-100 mw8 center data-table"
      var tableHeading = m('tr', [
        m('th', {
          class: headClass
        }, ''),
        m('th', {
          class: headClass
        }, 'Locn_Nbr'),
        m('th', {
          class: headClass
        }, 'Online_Ord_Id'),
        m('th', {
          class: headClass
        }, 'KSN_Id'),
        m('th', {
          class: headClass
        }, 'SKU_Pre_Type_Cd'),
      ])
      var tableRows = vnode.attrs.data.map(function (datum) {
        return m('tr', [
          m('td', {
            class: rowClass
          }, datum.sn),
          m('td', {
            class: rowClass
          }, datum.Locn_Nbr),
          m('td', {
            class: rowClass
          }, datum.Online_Ord_Id),
          m('td', {
            class: rowClass
          }, datum.KSN_Id),
          m('td', {
            class: rowClass
          }, datum.SKU_Pre_Type_Cd),
        ])
      })

      return m('div.data-list', m('table', {
        cellspacing: "0",
        class: tableClass
      }, [
        m('thead', tableHeading),
        m('tbody', tableRows)
      ]))
    }
  }

  /**
   * This component is the top level buttons and inputs
   * They take all the numbers to display as parameter 
   * from the top component and whenever anything changes,
   * they will call a callback function received from
   * parent and pass the changes
   */
  var ToolBar = {
    view: function (vnode) {
      var updateParams = vnode.attrs.updateParams
      var max = Math.max
      var min = Math.min
      return m('div.toolbar',[
        m('span.btn-group', [
          m('button.btn', {
            disabled: vnode.attrs.startingAt === 0,
            title: 'First Page',
            onclick: function () {
              updateParams(vnode.attrs.showing, 0)
            }
          }, "|<"),
          m('button.btn', {
            disabled: vnode.attrs.startingAt === 0,
            title: 'Previous page',
            onclick: function () {
              updateParams(vnode.attrs.showing, max(0, vnode.attrs.startingAt - vnode.attrs.showing))
            }
          }, "<<"),
          m('button.btn', {
            disabled: vnode.attrs.startingAt === 0,
            title: 'Previous record',
            onclick: function () {
              updateParams(vnode.attrs.showing, max(0, vnode.attrs.startingAt - 1))
            }
          }, "<"),
        ]),
        m('span.toolbar-text', 'Showing'),
        m('input.toolbar-input', {
          type: "number",
          min: 1,
          max: vnode.attrs.total,
          required: true,
          value: vnode.attrs.showing,
          onchange: function () {
            try {
              var showing = parseInt(this.value)
              updateParams(showing, vnode.attrs.startingAt)
            } catch (e) {
              console.error(e)
            }
          }
        }),
        m('span.toolbar-text', 'rows out of'),
        m('input.toolbar-input', {
          type: "number",
          value: vnode.attrs.total,
          max: vnode.attrs.total - 1,
          min: vnode.attrs.total - 1,
          readonly: true
        }),
        m('span.toolbar-text', 'starting at row'),
        m('input.toolbar-input', {
          type: "number",
          min: 1,
          max: vnode.attrs.total - 1,
          required: true,
          value: vnode.attrs.startingAt + 1,
          onchange: function () {
            try {
              var startAt = parseInt(this.value)
              updateParams(vnode.attrs.showing, startAt - 1)
            } catch (e) {
              console.error(e)
            }
          }
        }),
        m('span.btn-group', [
          m('button.btn', {
            disabled: vnode.attrs.startingAt >= max(0, vnode.attrs.total - vnode.attrs.showing),
            title: 'Next record',
            onclick: function () {
              updateParams(vnode.attrs.showing, min(vnode.attrs.total - 1, vnode.attrs.startingAt + 1))
            }
          }, ">"),
          m('button.btn', {
            disabled: vnode.attrs.startingAt >= max(0, vnode.attrs.total - vnode.attrs.showing),
            title: 'Next Page',
            onclick: function () {
              updateParams(vnode.attrs.showing, min(vnode.attrs.total - 1, vnode.attrs.startingAt + vnode.attrs.showing))
            }
          }, ">>"),
          m('button.btn', {
            disabled: vnode.attrs.startingAt >= max(0, vnode.attrs.total - vnode.attrs.showing),
            title: 'Last Page',
            onclick: function () {
              updateParams(vnode.attrs.showing, max(0, vnode.attrs.total - vnode.attrs.showing))
            }
          }, ">|"),
        ])

      ])
    }
  }

  /**
   * This is the top level component.
   * It stores the entire data and the varialbes required for slicing 
   * the data.
   * 
   * It passes the sliced data to the DataList based on the slicing parameters
   * It passes slicing parameters to ToolBar component which shows the 
   * corresponding value. This component also passes a Callback function to 
   * toolbar which gets called with the updated values of slicing parameters
   */
  var DataTable = {
    showing: 10,
    data: [],
    startingAt: 0,
    updateParams: function () {

    },
    oninit: function () {
      /**
       * Get the data. For practical application it should have been retrieved from
       * some API Calls, here it just reference the sampleData
       */
      this.data = sampleData
      this.showing = Math.min(10, this.data.length)
    },
    view: function () {
      var self = this
      return [
        m(ToolBar, {
          showing: this.showing,
          startingAt: this.startingAt,
          total: this.data.length,
          updateParams: function (showing, startAt) {
            self.showing = showing
            self.startingAt = startAt
          }
        }),
        m(DataList, {
          data: this.data.slice(this.startingAt, this.startingAt + this.showing)
        })
      ]
    }
  }

  m.mount(root, DataTable)
}())