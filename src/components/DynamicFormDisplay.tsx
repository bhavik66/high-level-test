/**
 * DynamicFormDisplay component - demonstrates the DynamicFormRenderer functionality
 */

import React, { useState } from 'react';
import type { FormDefinition } from '../types/formTypes';
import DynamicFormRenderer from './DynamicFormRenderer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {formDefinitionData.title}
          </CardTitle>
          {formDefinitionData.description && (
            <p className="text-gray-600 mt-2">
              {formDefinitionData.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            formDefinition={formDefinitionData as FormDefinition}
            values={formValues}
            onValuesChange={handleValuesChange}
          />
        </CardContent>
      </Card>

      {/* Debug section - you can remove this in production */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Form Values</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicFormDisplay;
