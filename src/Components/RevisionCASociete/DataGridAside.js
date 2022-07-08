import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import DataGrid, {
    Column,
    ColumnChooser,
    Editing,
    FilterRow,
    Grouping,
    GroupPanel,
    SearchPanel,
    Selection,
    Sorting,
    Summary,
    TotalItem,
    Paging,
    Pager,
    KeyboardNavigation,
    Scrolling,
    LoadPanel, Export
} from 'devextreme-react/data-grid';
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperGrid from 'csysframework-react/dist/Table/HelperGrid';
import {
    roundDecimalsWithoutSpaces,
    roundDecimalsWithSpaces,
    customizePourcentage
} from "../../Helper/editorTemplates";
import {
    getHistoriqueChiffreAffaireSociete,
    handleOpenModalChart,
    handleCloseModalChart
} from "../../Redux/Actions/RevisionCASociete/RevisionCASocieteAside";
import HelperDataGridAside from './HelperDataGridAside';

import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';

const DataGridAside = (obj) => {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const RevisionCASocieteAsideReducer = useSelector(state => state.RevisionCASocieteAsideReducer);
    let { modeAside } = RevisionCASocieteAsideReducer;

    const calculateCellValuePourcentageContribution = (rowData) => {
        return HelperDataGridAside.calculateCellValuePourcentageContribution(rowData, obj.dataGrid, obj.formObj);
    }
    const handleCalculateCellValuePourcentageContribution = () => {
        obj.dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
            selectedRowsData.forEach(rowData => {
                rowData.pourcentageContribution = calculateCellValuePourcentageContribution(rowData);
                obj.dataSource.update(rowData.codeSociete, rowData);
            });
        });
    }

    const handleChangeCellPourcentageEvolution = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value > -1000) && (value < 9999999))) {
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.chiffreAffairePrevisionnel = currentRowData.chiffreAffairePrevisionnel;
            notifyOptions.message = messages.pourcentageFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            if (currentRowData.chiffreAffaireReference === 0) {
                newData.pourcentageRevision = 0;
                newData.chiffreAffairePrevisionnel = 0;
                newData.pourcentageNouvelleContribution = 0;
                newData.variation = 0;
            } else {
                newData.pourcentageRevision = value;
                newData.chiffreAffairePrevisionnel = calculCellValueChiffreAffairePrevisionnel(currentRowData, value, obj.formObj.current.budget.coefficient);
                currentRowData.chiffreAffairePrevisionnel = newData.chiffreAffairePrevisionnel;
                newData.pourcentageNouvelleContribution = calculateCellValuePourcentageNouvelleContribution(currentRowData);
                newData.variation = calculCellValueVariation(currentRowData);
            }
            //update required for update from menuContext
            if (action === "handleContextMenu") {
                obj.dataSource.update(newData.codeSociete, newData).then(
                    () => { obj.dataGrid.current.instance.refresh(); },
                )
            }
            obj.dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    if (rowData.chiffreAffaireReference === 0) {
                        rowData.pourcentageRevision = 0;
                        rowData.chiffreAffairePrevisionnel = 0;
                        rowData.pourcentageNouvelleContribution = 0;
                        rowData.variation = 0;
                    } else {
                        rowData.pourcentageRevision = value;
                        rowData.chiffreAffairePrevisionnel = calculCellValueChiffreAffairePrevisionnel(rowData, value, obj.formObj.current.budget.coefficient);
                        rowData.pourcentageNouvelleContribution = calculateCellValuePourcentageNouvelleContribution(rowData);
                        rowData.variation = calculCellValueVariation(rowData);
                    }
                    obj.dataSource.update(rowData.codeSociete, rowData);
                });
            });
        }
    }
    const calculCellValueChiffreAffairePrevisionnel = (rowData, pourcentageRevision) => {
        return HelperDataGridAside.calculCellValueChiffreAffairePrevisionnel(rowData, pourcentageRevision, obj.formObj.current.budget.coefficient);
    }
    const handleChangeCellChiffreAffairePrevisionnel = (newData, value, currentRowData) => {

        if (!(value !== undefined && value !== null && !isNaN(value) && (value > 0) && (value < 9999999))) {
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.chiffreAffairePrevisionnel = currentRowData.chiffreAffairePrevisionnel;
            notifyOptions.message = messages.prixFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.chiffreAffairePrevisionnel = value;
            currentRowData.chiffreAffaireReference === 0 ?
                newData.pourcentageRevision = 0
                : newData.pourcentageRevision = ((value / (currentRowData.chiffreAffaireReference * obj.formObj.current.budget.coefficient)) - 1) * 100;
               
                currentRowData.chiffreAffairePrevisionnel = newData.chiffreAffairePrevisionnel;
                newData.pourcentageNouvelleContribution = calculateCellValuePourcentageNouvelleContribution(currentRowData);
            newData.variation = calculCellValueVariation(currentRowData);
            obj.dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    rowData.chiffreAffairePrevisionnel = value;
                    rowData.chiffreAffaireReference === 0 ?
                        rowData.pourcentageRevision = 0
                        : rowData.pourcentageRevision = ((value / (rowData.chiffreAffaireReference * obj.formObj.current.budget.coefficient)) - 1) * 100;
                    rowData.pourcentageNouvelleContribution = calculateCellValuePourcentageNouvelleContribution(rowData);
                    rowData.variation = calculCellValueVariation(rowData);
                    obj.dataSource.update(rowData.codeSociete, rowData);
                });
            });
        }
    }
    const calculateCellValuePourcentageNouvelleContribution = (rowData) => {
        return HelperDataGridAside.calculateCellValuePourcentageNouvelleContribution(rowData, modeAside, obj.formObj);
    }
    const handleCalculateCellValuePourcentageNouvelleContribution = () => {
        obj.dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
            selectedRowsData.forEach(rowData => {
                rowData.pourcentageNouvelleContribution = calculateCellValuePourcentageNouvelleContribution(rowData);
                obj.dataSource.update(rowData.codeSociete, rowData);
            });
        });
    }

    const calculCellValueVariation = (rowData) => {
        return HelperDataGridAside.calculCellValueVariation(rowData, modeAside, obj.formObj);
    }
    const handleCalculCellValueVariation = (obj) => {
        obj.dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
            selectedRowsData.forEach(rowData => {
                rowData.variation = calculCellValueVariation(rowData);
                obj.dataSource.update(rowData.codeSociete, rowData);
            });
        });
    }
    let onRowPrepared = (e) => {
        if (e.rowType === 'data' && e.data.codeSaisiSociete === "Autre") {
            e.rowElement.style.backgroundColor = '#99a1a8a8';
            e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
        }
    }


    /*******   tracage courbe historique tarif/volume  ********/
    const courbeHistorique = (currentRowData) => {

        if (currentRowData.row.key === undefined) {
            /** todo methode helper */
            notifyOptions.message = messages.DataNotFound
            notify(notifyOptions, 'error', notifyOptions.displayTime);
            return false;
        } else {

            let promise1 = dispatch(getHistoriqueChiffreAffaireSociete(currentRowData.row.data.codeSociete));
            promise1.then((dataToDraw) => {

                let series = [{ key: 'chiffreAffaire', valueField: 'chiffreAffaire', name: messages.chiffreAffaire }];
                let valuesAxis = [{ name: 'chiffreAffaire', position: 'left', title: messages.chiffreAffaire, format: { type: 'fixedPoint', precision: 2 } }];
                let subtitle = `${messages.titreChartSociete}${currentRowData.row.data.designationSociete}`;
                let handleBtnFermerModalChart = () => {
                    dispatch(handleCloseModalChart());
                }
                let parametres = { dataToDraw: dataToDraw, series: series, valuesAxis: valuesAxis, subtitle: subtitle, handleBtnFermerModalChart: handleBtnFermerModalChart }
                dispatch(handleOpenModalChart(parametres));
            });
        }
    };
    
  //  const numberFormatter = (value) => new Intl.NumberFormat("ja-JP").format(Math.round(value));

    const customizesumCaRef = () => {
        let text = 'Total ca ref';
        let sum = obj.formObj.current.sumCaRefGeneral !== undefined ?
            obj.formObj.current.budget !== null ? obj.formObj.current.sumCaRefGeneral : 0
            : 0;
        return `${text}: ${roundDecimalsWithSpaces(sum)}`;
    }
    const customizePourcentageContribution = (data) => {
        let text = 'Total Contribution';
        return `${text}: ${roundDecimalsWithSpaces(data.value)} %`;
    }
    const customizesumCaPrevisionnel = (data) => {
        let text = 'Total ca Previsionnel';
        return `${text}: ${roundDecimalsWithSpaces(data.value)}`;
    }
    const isHistoriqueIconVisible = (e) => {
        return e.row.data.codeSaisiSociete !== 'Autre';
    }
    const customizeIsPayant = (e) => {
        return e.value === true ? messages.isPayant : messages.isNotPayant;
    }
    const handleDataGridContextMenuPreparing = (e) => {
        if (e.row && e.row.rowType === "data" && (e.columnIndex === 3 || e.columnIndex === 4)) {
            if (!e.items) e.items = [];
            e.items.push({
                text: 'Appliquer sur toutes les categories',
                onItemClick: () => {
                    handleAppliquerToutCategorieSociete(e.row.data);
                }
            });
        }
    }
    const handleAppliquerToutCategorieSociete = (rowData) => {
        obj.formObj.current.listeDetailsRevisionChiffreAffaireSociete
            .filter((societe) => {
                return societe.codeSociete !== rowData.codeSociete && societe.codeSaisiSociete !== "Autre" && societe.codeCategorieSociete === rowData.codeCategorieSociete
            }).map((item, key) => {
                handleChangeCellPourcentageEvolution(item, rowData.pourcentageRevision, item, "handleContextMenu");
            });
    }

    const onFocusedCellChanging = (e) => {
        if (e.element.isContentEditable === true) {
            e.isHighlighted = true;
        }
    }
    const calculateSortValue = (data) => {
        return data.orderCategorieSociete;
    }
    const calculateGroupValue = (data) => {
        return data.designationCategorieSociete;
    }
    const groupingFormat = (elem, data) => {

        var formattedValue = data.column.dataField + ": " + data.displayValue + " new format";
        elem.append(formattedValue);
    }
    return (
        <DataGrid className='DataGrid'
            ref={obj.dataGrid}
            dataSource={obj.dataSource}
            keyExpr={'codeSociete'}
            onToolbarPreparing={obj.onToolbarPreparing}
            showColumnLines={true}
            showRowLines={true}
            showBorders={true}
            rowAlternationEnabled={true}
            rtlEnabled={direction === "RTL"}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onContextMenuPreparing={handleDataGridContextMenuPreparing}
            onRowPrepared={obj.onRowPrepared && onRowPrepared}
            onContentReady={HelperGrid.onContentReady}
            onFocusedCellChanging={onFocusedCellChanging}
            focusStateEnabled={true}
            height={514}
        >
            <Scrolling mode="standard"
                showScrollbar="always" />
            <Paging defaultPageSize={15} />
            <Pager showPageSizeSelector={true}
                allowedPageSizes={[15, 30, 45]}
                showInfo={true}
                visible={true}
                showNavigationButtons={true} />
            <LoadPanel enabled={true} />
            {(obj.modeAside === 'ADD' || obj.modeAside === 'EDIT')
                && <Selection mode="multiple"
                    allowSelectAll={true}
                    deferred={true} />
            }
            <FilterRow visible={true} applyFilter={true} />
            <Sorting mode={'multiple'} />
            <SearchPanel visible={false} />
            <Grouping contextMenuEnabled={true} autoExpandAll={true} />
            <GroupPanel allowColumnDragging={false} visible={true} />
            <ColumnChooser enabled={true} />
            <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction={'startEdit'}
                enterKeyDirection={'row'} />
            <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true} />
            <Export enabled={true}
                    fileName={obj.fileNameToExport}
                    allowExportSelectedData={true} />
            <Column
                dataField={'orderCategorieSociete'}
                visible={false}
                defaultSortIndex={0}
                sortIndex={0}
                sortOrder={'asc'}
            />
            <Column
                dataField={'isPayant'}
                visible={false}
                caption={messages.nature}
                allowGrouping={true}
                allowSorting={false}
                groupIndex={0}
                // sortIndex={0}
                //  sortOrder={'asc'}
                customizeText={customizeIsPayant}
            //  calculateSortValue={'orderCategorieSociete'}
            />
            <Column
                dataField={'designationCategorieSociete'}
                //visible={false}
                caption={messages.categorieSociete}
                allowEditing={false}
                //  cellRender={cellRender}
                //allowGrouping={true}
                allowSorting={true}
                groupIndex={2}
                autoExpandGroup={false}
                defaultSortIndex={0}
                defaultSortOrder={'asc'}
                //  calculateDisplayValue={'designationCategorieSociete'} 
                calculateSortValue={calculateSortValue}
            />
            {/*   <Column
                dataField={'designationCategorieSociete'}
                //visible={true}
                caption={messages.categorieSociete}
                //sortOrder={'asc'}  
                groupIndex={1}
                sortIndex={1}
                visible={true}
               // calculateDisplayValue={calculateGroupValue}
               // calculateGroupValue={calculateGroupValue} 
            />  */}
            <Column
                dataField={'codeSaisiSociete'}
                caption={messages.codeSaisi}
                allowEditing={false}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                dataField={'designationSociete'}
                caption={messages.societe}
                allowSorting={false}
                allowEditing={false}
            />

            <Column
                dataField={'chiffreAffaireReference'}
                caption={messages.chiffreAffaireReference}
                format={{ type: "fixedPoint", precision: 0 }}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                sortOrder={'desc'}
                defaultSortIndex={1}
                allowEditing={false}
                allowFiltering={false}
            />
            <Column
                dataField={'pourcentageContribution'}
                caption={messages.pourcentageContribution}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                allowEditing={false}
                allowFiltering={false}
                customizeText={customizePourcentage}
                calculateCellValue={modeAside === 'ADD' && calculateCellValuePourcentageContribution}
                setCellValue={modeAside === 'ADD' && handleCalculateCellValuePourcentageContribution}
            />
            <Column
                type={'buttons'}
                buttons={[{
                    hint: messages.historiqueCASociete,
                    icon: 'chart',
                    visible: isHistoriqueIconVisible,
                    onClick: courbeHistorique
                }]}
                width={40}
                allowFiltering={false}
            />
            <Column
                dataField={'pourcentageRevision'}
                caption={messages.pourcentageEvolution}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                customizeText={customizePourcentage}
                allowEditing={obj.editable}
                allowFiltering={false}
                setCellValue={handleChangeCellPourcentageEvolution}
            />
            <Column
                dataField={'chiffreAffairePrevisionnel'}
                caption={messages.chiffreAffairePrevisionnel}
                format={{ type: "fixedPoint", precision: 0 }}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                allowEditing={obj.editable}
                allowFiltering={false}
                setCellValue={handleChangeCellChiffreAffairePrevisionnel}
            />
            <Column
                dataField={'pourcentageNouvelleContribution'}
                caption={messages.pourcentageNouvelleContribution}
                customizeText={customizePourcentage}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                allowEditing={false}
                allowFiltering={false}
                calculateCellValue={calculateCellValuePourcentageNouvelleContribution}
                setCellValue={handleCalculateCellValuePourcentageNouvelleContribution}
            />
            <Column
                dataField={'variation'}
                caption={messages.variation}
                format={{ type: "fixedPoint", precision: 0 }}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                allowEditing={false}
                allowFiltering={false}
                calculateCellValue={calculCellValueVariation}
                setCellValue={handleCalculCellValueVariation}
                width={100}
            />
            <Summary>
                {/* <GroupItem
                    name="sumCaRefPayant"
                    column="chiffreAffaireReference"
                    summaryType="sum"
                    customizeText={roundDecimalsWithSpacesAndWithoutDecimalAfterComma} 
              displayFormat={'sumCaRefPayant: {0}'}
              showInGroupFooter={true}/> 
               {/*  <GroupItem
                    name="sumCaRefNonPayant"
                    column="chiffreAffaireReference"
                    summaryType="sum"
                    customizeText={roundDecimalsWithSpacesAndWithoutDecimalAfterComma} 
                    displayFormat={'sumCaRefNonPayant: {0}'}
                    showInGroupFooter={true}
                /> */}
                <TotalItem
                    name="sumCaRefGeneral"
                    column="chiffreAffaireReference"
                    summaryType="sum"
                    //valueFormat={{ type: "fixedPoint", precision: 0 }}
                    customizeText={customizesumCaRef}
                //showInColumn="TotalCaRef" 
                // showInGroupFooter={true}
                />
                <TotalItem
                    name="sumPourcentageContribution"
                    column="pourcentageContribution"
                    summaryType="sum"
                    //valueFormat={{ type: "fixedPoint", precision: 3 }}
                    customizeText={customizePourcentageContribution}
                />
                <TotalItem
                    name="sumCaPrevisionnelGeneral"
                    column="chiffreAffairePrevisionnel"
                    summaryType="sum"
                    customizeText={customizesumCaPrevisionnel}
                />
            </Summary>
        </DataGrid>
    )

}
export default DataGridAside