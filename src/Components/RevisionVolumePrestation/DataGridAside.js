import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import DataGrid, {
    Column,
    ColumnChooser,
    Editing,
    Export,
    FilterRow,
    Grouping,
    SearchPanel,
    Selection,
    Sorting,
    KeyboardNavigation,
    Scrolling,
    Paging,
    LoadPanel,
    Pager
} from 'devextreme-react/data-grid';
import Helper from 'csysframework-react/dist/Utils/Helper';
import HelperDataPrestationGridAside from './HelperDataGridAside';
import notify from "devextreme/ui/notify";
import { notifyOptions } from 'csysframework-react/dist/Utils/Config';

import {
    roundDecimalsWithSpaces,
    roundDecimalsWithoutSpaces,
    customizePourcentage
} from "../../Helper/editorTemplates";

//-- acte
let getHistoriqueVolumeByPrestation = {};
let handleOpenModalChart = {};
let handleCloseModalChart = {};
//-- sans acte
let getHistoriqueVolumeBySansActe = {}

import 'status-indicator/styles.css';
const DataGridAside = (obj) => {

    let { isActe,
        dataGrid,
        keyExprDataGrid,
        dataSource,
        editable,
        formObj,
        modeAside,
        onContentReady,
        onFocusedCellChanging,
        onRowPrepared,
        onToolbarPreparing
    } = { ...obj };

    let nameListeOfColumn = isActe ? "listeRevisionActeFamillePrestationDTO" : formObj && formObj.current && formObj.current.isMotif ? "listeRevisionFamillePrestationDTO" : "listeRevisionSpecialiteFamillePrestationDTO";
    let keyExprChart = isActe ? 'codePrestation' : formObj.current.isMotif ? "codeMotifAdmission" : "codeSpecialiteMedecin";
    let isMotif = formObj && formObj.current && formObj.current.isMotif;

    keyExprDataGrid = isActe ? 'codeActe' : formObj && formObj.current && formObj.current.isMotif ? 'codeMotif' : 'codeSpecialite'

    const importActions = isActe ? import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumePrestationAside")
        : import("../../Redux/Actions/RevisionVolumePrestation/RevisionVolumeSansActeAside");
    importActions.then((result) => {

        getHistoriqueVolumeByPrestation = isActe ? result.getHistoriqueVolumeByPrestation
            : formObj.current.isMotif ? result.getHistoriqueVolumeMotifAdmissions : result.getHistoriqueVolumeSpecialiteMedecins;
        handleOpenModalChart = isActe ? result.handleOpenModalChart : result.handleOpenModalChart;
        handleCloseModalChart = isActe ? result.handleCloseModalChart : result.handleCloseModalChart;

    });

    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);

    const renderRoundDecimal = (data) => {
        return roundDecimalsWithSpaces(data.value);
    }

    let handleChangeCellpourcentageRevision = (newData, value, currentRowData, action) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value >= -100) && (value < 9999999))) {
            newData.volumeReference = currentRowData.volumeReference;
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.volumePrevisionnel = currentRowData.volumePrevisionnel;
            newData[nameListeOfColumn] = currentRowData[nameListeOfColumn];

            notifyOptions.message = messages.pourcentageFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {

            newData.pourcentageRevision = roundDecimalsWithoutSpaces(value);
            newData.volumePrevisionnel = roundDecimalsWithoutSpaces(currentRowData.volumeReference * (1 + (value / 100)) * formObj.current.budget.coefficient) ;
            currentRowData.volumePrevisionnel = roundDecimalsWithoutSpaces(newData.volumePrevisionnel);
            newData[nameListeOfColumn] = currentRowData[nameListeOfColumn]
                .map((item, index) => {
                    currentRowData[nameListeOfColumn][index].montantPrevisionnel = currentRowData[nameListeOfColumn][index].montantReference * (1 + (value / 100)) * formObj.current.budget.coefficient;
                    return currentRowData[nameListeOfColumn][index];
                })
            //update required for update from menuContext
            if (action !== undefined && action === "handleContextMenu") {
                dataSource.update(newData.codeActe, newData).then(
                    () => { dataGrid.current.instance.refresh(); },
                )
            }


            dataGrid.current.instance.getSelectedRowsData().then((selectedRowsData) => {
                selectedRowsData.forEach(rowData => {
                    rowData.pourcentageRevision = roundDecimalsWithoutSpaces(value);
                    rowData.volumePrevisionnel = roundDecimalsWithoutSpaces(rowData.volumeReference * (1 + (value / 100)) * formObj.current.budget.coefficient) ;
                    rowData[nameListeOfColumn] = rowData[nameListeOfColumn]
                        .map((item, index) => {
                            rowData[nameListeOfColumn][index].montantPrevisionnel = roundDecimalsWithoutSpaces(rowData[nameListeOfColumn][index].montantReference * (1 + (value / 100)) * formObj.current.budget.coefficient);
                            return rowData[nameListeOfColumn][index];
                        })
                    dataSource.update(rowData.codeActe, rowData);
                });

            });
        }
    }

    let handleChangeCellVolumePrevisionnel = (newData, value, currentRowData,) => {
        if (!(value !== undefined && value !== null && !isNaN(value) && (value > 0) && (value < 9999999))) {
            newData.volumeReference = currentRowData.volumeReference;
            newData.pourcentageRevision = currentRowData.pourcentageRevision;
            newData.volumePrevisionnel = currentRowData.volumePrevisionnel;
            newData[nameListeOfColumn] = currentRowData[nameListeOfColumn];
            notifyOptions.message = messages.prixFailed;
            notify(notifyOptions, 'error', notifyOptions.displayTime);
        } else {
            newData.volumePrevisionnel = roundDecimalsWithoutSpaces(value, 0);
            currentRowData.volumeReference === 0 ?
                newData.pourcentageRevision = 0
                : newData.pourcentageRevision = roundDecimalsWithoutSpaces(((value / (currentRowData.volumeReference * formObj.current.budget.coefficient)) - 1) * 100);
            newData[nameListeOfColumn] = currentRowData[nameListeOfColumn]
                .map((item, index) => {
                    currentRowData[nameListeOfColumn][index].montantPrevisionnel = currentRowData[nameListeOfColumn][index].montantReference * (1 + (newData.pourcentageRevision / 100)) * formObj.current.budget.coefficient;
                    return currentRowData[nameListeOfColumn][index];
                })
        }
    }

    /*******   tracage courbe historique volume  ********/
    const courbeHistorique = (currentRowData) => {
        if (currentRowData.row.key === undefined) {
            /** todo methode helper */
            notifyOptions.message = messages.DataNotFound
            notify(notifyOptions, 'error', notifyOptions.displayTime);
            return false;
        } else {

            let promise1 = dispatch(getHistoriqueVolumeByPrestation(currentRowData.row.data[keyExprDataGrid]));
            promise1.then((res) => {
                let dataToDraw = res.map((item, key) => {
                    item.annee = item.annee.toString();
                    return item;
                })

                let series = [{ key: keyExprChart, valueField: 'quantite', name: messages.volume }];
                let valuesAxis = [{ name: 'quantite', position: 'left', title: messages.volume }];
                let subtitle = isActe ? `${messages.titreChartActe}${currentRowData.row.data.designationActe}`
                    : formObj.current.isMotif ? `${messages.titreChartMotif}${currentRowData.row.data.designationMotif}`
                        : `${messages.titreChartSpecialite}${currentRowData.row.data.designationSpecialite}`;

                let handleBtnFermerModalChart = () => {
                    dispatch(handleCloseModalChart());
                }
                let parametres = {
                    dataToDraw: dataToDraw.map((item) => { item.annee = item.annee.toString(); return item; }),
                    series: series, valuesAxis: valuesAxis,
                    subtitle: subtitle,
                    handleBtnFermerModalChart: handleBtnFermerModalChart
                }
                dispatch(handleOpenModalChart(parametres));

            });
        }
    };

    const isHistoriqueIconVisible = (e) => {
        return e.row.data.codeSaisi !== 'Autre';
    }
    const handleDataGridContextMenuPreparing = (e) => {
        if ((modeAside === 'ADD' || modeAside === 'EDIT' ) && isActe)
            if (e.row && e.row.rowType === "data" && (e.columnIndex === 1 || e.columnIndex === 2 || e.columnIndex === 3)) {
                if (!e.items) e.items = [];
                e.items.push({
                    text: messages.contextMenuItems_famille,
                    onItemClick: () => {
                        handleAppliquerToutFamillePrestation(e.row.data);
                        console.log(e.column.caption);
                    }
                },
                    {
                        text: messages.contextMenuItems_sousfamille,
                        onItemClick: () => {
                            handleAppliquerToutSousFamillePrestation(e.row.data)
                        }
                    });
            }
    }
    const handleAppliquerToutFamillePrestation = (rowData) => {
        formObj.current.listeDetailsRevision
            .filter((prestation) => {
                return prestation.codeFamillePrestation === rowData.codeFamillePrestation;
            })
            .map((item, key) => {
                item.pourcentageRevision = rowData.pourcentageRevision;
                handleChangeCellpourcentageRevision(item, rowData.pourcentageRevision, item, "handleContextMenu");
            });
    }
    const handleAppliquerToutSousFamillePrestation = (rowData) => {
        formObj.current.listeDetailsRevision
            .filter((prestation) => {
                return prestation.codeSousFamillePrestation === rowData.codeSousFamillePrestation;
            })
            .map((item, key) => {
                item.pourcentageRevision = rowData.pourcentageRevision;
                handleChangeCellpourcentageRevision(item, rowData.pourcentageRevision, item, "handleContextMenu");
            });
    }

    return (

        <DataGrid className='DataGrid'
            ref={dataGrid}
            dataSource={dataSource}
            keyExpr={keyExprDataGrid}
            showBorders={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            rtlEnabled={direction === "RTL"}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            onToolbarPreparing={onToolbarPreparing}
            onRowPrepared={onRowPrepared}
            onContentReady={onContentReady}
            hoverStateEnabled={true}
            height={514}
            onFocusedCellChanging={onFocusedCellChanging}
            focusStateEnabled={true}
            onContextMenuPreparing={handleDataGridContextMenuPreparing}
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
            <KeyboardNavigation
                editOnKeyPress={true}
                enterKeyAction={'startEdit'}
                enterKeyDirection={'row'} />
            {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Editing mode={'cell'} allowUpdating={true} allowAdding={true} selectTextOnEditStart={true} />
            }


            {(modeAside === 'ADD' || modeAside === 'EDIT')
                && <Selection mode="multiple"
                    allowSelectAll={true}
                    deferred={true} />
            }
            <Export enabled={true}
                fileName={isActe ? messages.listeRevisionVolumeAvecActe : messages.listeRevisionVolumeSansActe}
                allowExportSelectedData={true} />
            <FilterRow visible={true} applyFilter={true} />
            <Sorting mode={'single'} />
            <SearchPanel visible={true} placeholder={messages.search} />
            <Grouping contextMenuEnabled={true} autoExpandAll={true} />
            <ColumnChooser enabled={true} />
            <Column
                dataField={isActe ? 'codeSaisiActe' : isMotif ? 'codeSaisiMotif' : 'codeSaisiSpecialite'}
                caption={messages.Code}
                fixed={true}
                fixedPosition={direction === "RTL" ? "rigth" : "left"}
                sortOrder={'asc'}
                allowEditing={false}
                allowGrouping={false}
                allowUpdating={false}
                width={80}
            />
            <Column
                dataField={isActe ? 'designationActe' : isMotif ? 'designationMotif' : 'designationSpecialite'}
                caption={messages.prestation}
                fixed={true}
                alignment={direction === "RTL" ? "rigth" : "left"}
                allowEditing={false}
                allowUpdating={false}
                width={200}
            />

            <Column
                dataField={'volumeReference'}
                caption={messages.volumeReference}
                fixed={true}
                cssClass="direction grey"
                alignment={direction === "RTL" ? "rigth" : "left"}
                format={{ type: "fixedPoint", precision: 0 }}
                allowFiltering={false}
                allowEditing={false}
            />
            <Column
                dataField={'pourcentageRevision'}
                caption={messages.pourcentageEvolution}
                cssClass="direction"
                alignment={direction === "RTL" ? "right" : "left"}
                format={{ type: "fixedPoint", precision: 3 }}
                fixed={true}
                customizeText={customizePourcentage}
                allowEditing={editable}
                allowFiltering={false}
                setCellValue={handleChangeCellpourcentageRevision}
            />
            <Column
                dataField={'volumePrevisionnel'}
                caption={messages.volumePrevisionnel}
                cssClass="direction"
                alignment={direction === "RTL" ? "rigth" : "left"}
                format={{ type: "fixedPoint", precision: 0 }}
                fixed={true}
                allowEditing={editable}
                allowFiltering={false}
                setCellValue={handleChangeCellVolumePrevisionnel}
            />
            <Column
                type={'buttons'}
                width={60}
                fixed={true}
                buttons={[{
                    hint: isActe ? messages.historiqueVolumeActe : messages.historiqueVolumeSansActe,
                    icon: 'chart',
                    visible: isHistoriqueIconVisible,
                    onClick: courbeHistorique

                }]}
            />
            {
                HelperDataPrestationGridAside.prepareDataToDrawListeRevisionActeFamille(formObj)
                    .map((item, firstIndex) =>
                        //TODO
                        (
                            item[nameListeOfColumn]
                            && (isActe && item.codeActe != 0 || item.codeMotif != 0 || item.codeSpecialite != 0))
                        && item[nameListeOfColumn]
                            .sort((a, b) => (a.ordreAffichage > b.ordreAffichage) ? 1 : -1)
                            .map((row, index) => {
                                return (firstIndex == 0 &&

                                    <Column key={row} caption={row.designationFamillePrestation}>
                                        width={100}
                                        <Column
                                            dataField={`${nameListeOfColumn}[${index}].montantReference`}
                                            cssClass="direction green"
                                            alignment={direction === "RTL" ? "rigth" : "left"}
                                            format={{ type: "fixedPoint", precision: 0 }}
                                            customizeText={renderRoundDecimal}
                                            caption={messages.CAReReference}
                                            allowFiltering={false}
                                            allowSorting={false}
                                            allowEditing={false}
                                            width={80}
                                        />

                                        <Column
                                            dataField={`${nameListeOfColumn}[${index}].montantPrevisionnel`}
                                            cssClass="direction grey"
                                            alignment={direction === "RTL" ? "rigth" : "left"}
                                            format={{ type: "fixedPoint", precision: 0 }}
                                            customizeText={renderRoundDecimal}
                                            allowSorting={false}
                                            allowFiltering={false}
                                            allowEditing={false}
                                            caption={messages.CAPrevisionnel}
                                            width={90}
                                        />

                                    </Column>


                                )
                            })
                    )
            }

            <Editing mode={'cell'} allowUpdating={true} AllowAdding={true} AllowDeleting={true} AllowDragging={true} />
        </DataGrid>

    )

}
export default DataGridAside