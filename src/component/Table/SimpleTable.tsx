import MaterialTable from 'material-table';
import React from 'react';

export default function MaterialTableDemo({columns, data, onSelectionChange = (row) => {}}) {
  //Material-table 사용
  return (
    <div >
      <MaterialTable
        title="Editable Example"
        columns={columns}
        data={data}
        components = {{
          Toolbar : props => null,
          Container : props =>  <div style={{}}>{props.children}</div>,
        }}
        options = {{
          selection : true,
          headerStyle : {
            background:'#eee',
            borderBottom:'2px solid black'
          },
          pageSizeOptions : [4,],
          pageSize:4,
        }}
        onSelectionChange={onSelectionChange}
        />
    </div>
  );
}
