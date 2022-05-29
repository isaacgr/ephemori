import React from "react";
import ImportantDateSelector from "./ImportantDateSelector";
import ImportantDatesTable from "./ImportantDatesTable";

const ImportantDates = ({
  importantDates,
  addImportantDates,
  removeImportantDates,
  maxDates
}) => {
  return (
    <div className="important-dates">
      <div className="content-block">
        <ImportantDateSelector
          maxDates={maxDates}
          importantDates={importantDates}
          addImportantDates={addImportantDates}
        />
      </div>
      <div className="content-block">
        {importantDates.length > 0 && (
          <ImportantDatesTable
            removeImportantDates={removeImportantDates}
            importantDates={importantDates}
            className="settings"
          />
        )}
      </div>
    </div>
  );
};

export default ImportantDates;
