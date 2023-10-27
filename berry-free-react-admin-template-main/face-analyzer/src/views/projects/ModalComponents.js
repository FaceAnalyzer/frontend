import {styled} from "@mui/material/styles";

export const ModalOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, /* Ensure it's on top of other content */
});

export const Modal = styled('div')({
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    maxWidth: {
        xs: 400,
        lg: 475,
    },
    margin: {
        xs: 2.5,
        md: 3,
    },
    '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
    },
});

export const ModalContent = styled('div')({
    padding: '20px',
});

export const ModalHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space between',
  alignItems: 'center',
  borderBottom: '1px solid #ccc',
  padding: '10px 20px',
});

export const ModalBody = styled('div')({
    padding: '20px',
});

export const ModalFooter = styled('div')({
    borderTop: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '10px 20px',
});