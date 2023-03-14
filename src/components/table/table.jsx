import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    Button,
    Select,
    Flex,
  } from '@chakra-ui/react'
import { format } from 'date-fns'
import es from "date-fns/locale/es"; 
import { rows } from '../columns-rows/rows'
import { columns } from '../columns-rows/columns'
import { filterRows, paginateRows, sortRows } from '../helpers/helpers'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import React, { useMemo, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import TablePagination from '../pagination/table-pagination'
import "react-datepicker/dist/react-datepicker.css";

function TableComponent(){

    // States and variables
    const [selectedDate, setSelectedDate] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })
    const rowsPerPage = 6;
  
    const filteredRows = useMemo(() => filterRows(rows, filters), [rows, filters]);
    const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort]);
    const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

    const count = filteredRows.length;
    const totalPages = Math.ceil(count / rowsPerPage);

    // Function that handles the search filters
    const handleSearch = (value, accessor) => {
        setActivePage(1);
        
        if (value) {
            setFilters(prevFilters => ({
            ...prevFilters,
            [accessor]: value,
            }))
        } else {
            setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };
            delete updatedFilters[accessor];
        
            return updatedFilters;
            })
        }
    }

    // Function that handles the sorting method
    const handleSort = accessor => {
        setActivePage(1);
        setSort(prevSort => ({
          order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
          orderBy: accessor,
        }))
      }

    // Function that handles onChange method in calendar
    const doubleChange = (date, column) => {
        setSelectedDate(date);
        handleSearch(date ? format(date,'P') : '', column.accessor);
    }

    // Function that clear selected date in calendar
    const deleteDate = (value, accessor) => {
        setSelectedDate('');
        handleSearch(value, accessor);
    }

    const deleteSearch = (value, accessor) => {
        handleSearch(value, accessor);
        document.getElementById(`${accessor}-filter`).value='';
    }

    // Call to function that register language in the calendar
    registerLocale("es", es); 
   
    // Render of the table
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                <Tr>
                {columns.map(column => {
                    const sortIcon = () => {
                        if (column.accessor === sort.orderBy) {
                            if (sort.order === 'asc') {
                                return <ArrowUpIcon/>
                            } else {
                                return <ArrowDownIcon/>
                            }
                        } else {
                        return <ArrowUpDownIcon/>
                        }
                    }

                    return (
                        <Th key={column.accessor} v>
                            <span style={{fontSize: '18px'}}>{column.label}</span>
                            <p style={{fontSize: '12px', marginTop: '15px'}}>Orden:<Button size='xs' padding='10px' marginStart='10px' onClick={() => handleSort(column.accessor)}>{sortIcon()}</Button></p>
                        </Th>
                    )
                })}
                </Tr>
                <Tr>
                    {columns.map((column) => {
                    return (
                        <Th>
                            {column.accessor === 'is_manager' ? 
                                <Flex>
                                    <Select
                                        key={`${column.accessor}-search`}
                                        id={`${column.accessor}-filter`}
                                        placeholder='Seleccionar opción'
                                        onChange={(event) => handleSearch(event.target.value, column.accessor)}
                                    >
                                        <option value={true}>Sí</option>
                                        <option value={false}>No</option>
                                    </Select>
                                    {filters[column.accessor] ? 
                                        <Button marginStart='8px' value='' onClick={(event) => deleteSearch(event.target.value, column.accessor)}><DeleteIcon/></Button>
                                    :
                                        <Button isDisabled marginStart='8px' ><DeleteIcon/></Button>
                                    }
                                </Flex>
                            :
                            column.accessor === 'start_date' ?
                                <Flex>
                                    <DatePicker
                                        key={`${column.accessor}-search`}
                                        locale="es" 
                                        selected={selectedDate}
                                        onChange={(date) => {doubleChange(date, column)}}
                                        placeholderText="Buscar por fecha"
                                        customInput={<Input type='search'/>}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        scrollableYearDropdown
                                    />
                                    {selectedDate ? 
                                        <Button marginStart='8px' value='' onClick={(event) => deleteDate(event.target.value, column.accessor)}><DeleteIcon/></Button>
                                    :
                                        <Button isDisabled marginStart='8px' ><DeleteIcon/></Button>
                                    }
                                </Flex>
                            :
                                <Flex>
                                    <Input
                                        key={`${column.accessor}-search`}
                                        id={`${column.accessor}-filter`}
                                        placeholder={`Buscar por ${column.label.toLowerCase()}`}
                                        value={filters[column.accessor]}
                                        onChange={(event) => handleSearch(event.target.value, column.accessor)}
                                    />
                                    {filters[column.accessor] ? 
                                        <Button marginStart='8px' value='' onClick={(event) => deleteSearch(event.target.value, column.accessor)}><DeleteIcon/></Button>
                                    :
                                        <Button isDisabled marginStart='8px' ><DeleteIcon/></Button>
                                    }
                                </Flex>
                            }
                        </Th>
                    )
                    })}
                </Tr>
                </Thead>
                <Tbody>
                    {calculatedRows.map(row => {
                    return (
                        <Tr key={row.id}>
                        {columns.map(column => {
                            if (column.format) {
                            return <Td key={column.accessor}>{column.format(row[column.accessor])}</Td>
                            }
                            return <Td key={column.accessor}>{row[column.accessor]}</Td>
                        })}
                        </Tr>
                    )
                    })}
                </Tbody>
            </Table>
            <TablePagination
                activePage={activePage}
                count={count}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                setActivePage={setActivePage}
            />
        </TableContainer>
    )
}

export default TableComponent