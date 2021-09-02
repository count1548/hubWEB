import { Theme, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default function CustomizedTooltips(props) { //Material-ui Tooltip 사용
    const {children, text} = props
    return (
        <HtmlTooltip
            title={<React.Fragment>{text}</React.Fragment>}
            placement="left">
            <span>{children}</span>
        </HtmlTooltip>
    );
}