import { ArrowBackIcon, ArrowForwardIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

function TablePagination ({ activePage, count, rowsPerPage, totalPages, setActivePage }) {
  const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1
  const end = activePage === totalPages ? count : beginning + rowsPerPage - 1

  return (
    <>
      <div className="pagination" style={{marginTop: '20px'}}>
        <Button  colorScheme='teal' size='sm' margin='2' disabled={activePage === 1} onClick={() => setActivePage(1)}>
          <ArrowLeftIcon marginEnd='10px' boxSize='8px'/> Inicio
        </Button>
        <Button  colorScheme='teal' size='sm' margin='2' disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}>
          <ArrowBackIcon marginEnd='10px'/> Anterior
        </Button>
        <Button  colorScheme='teal' size='sm' margin='2' disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}>
          Siguiente <ArrowForwardIcon marginStart='10px'/>
        </Button>
        <Button  colorScheme='teal' size='sm' margin='2' disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}>
          Fin <ArrowRightIcon marginStart='10px' boxSize='8px'/>
        </Button>
      </div>
      <p style={{marginTop: '10px'}}>
        Página {activePage} de {totalPages}
      </p>
      <p>
        Filas: {beginning === end ? end : `${beginning} - ${end}`} de {count}
      </p>
    </>
  )
  }

export default TablePagination