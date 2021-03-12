import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
            </IconButton>
        ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

function DenseTable(node) {

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell align="center"><b>Assunto</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {node.DICIONARIO.map(item => {
                    return <TableRow>
                        <TableCell>{item.id}</TableCell>
                        <TableCell align="center">{item.assunto.map((assunto, index) => item.assunto[index + 1] ? `${assunto}, ` : `${assunto}`)}</TableCell>
                    </TableRow>
                })}
            </TableBody>
            </Table>
        </TableContainer>
        );
    }


export default function Dictionary({close, open, node}) {

    return (
        <div>
            <Dialog onClose={close} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={close}>
                Dicionário de Dados
                </DialogTitle>
                <DialogContent dividers>
                    {DenseTable(node)}
                </DialogContent>
            </Dialog>
        </div>
    );
}
