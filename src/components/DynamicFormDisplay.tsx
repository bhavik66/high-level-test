/**
 * DynamicFormDisplay component - demonstrates the DynamicFormRenderer functionality
 */

import React, { useState } from 'react';
import type { FormDefinition } from '../types/formTypes';
import DynamicFormRenderer from './DynamicFormRenderer';

// Import the form data
import formDefinitionData from '../assets/data/dynamicFormDefinition.json';
import initialValuesData from '../assets/data/dynamicFormValues.json';

const DynamicFormDisplay: React.FC = () => {
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(initialValuesData);

  const handleValuesChange = (newValues: Record<string, unknown>) => {
    console.log('Form values changed:', newValues);
    setFormValues(newValues);
  };

  return (
    <div className="container h-full overflow-y-auto">
      <DynamicFormRenderer
        formDefinition={formDefinitionData as FormDefinition}
        values={formValues}
        onValuesChange={handleValuesChange}
      />
    </div>
  );
};

export default DynamicFormDisplay;
