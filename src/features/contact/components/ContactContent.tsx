import { ConfigurableFormRenderer } from '@/components/dynamic-forms';
import type { FormDefinition } from '@/types/formTypes';
import { useState } from 'react';

// Import the form data
import formDefinitionData from '@/assets/data/dynamicFormDefinition.json';
import initialValuesData from '@/assets/data/dynamicFormValues.json';

const ContactContent = () => {
  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(initialValuesData);

  const handleValuesChange = (newValues: Record<string, unknown>) => {
    console.log('Form values changed:', newValues);
    setFormValues(newValues);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <ConfigurableFormRenderer
        formDefinition={formDefinitionData as FormDefinition}
        values={formValues}
        onValuesChange={handleValuesChange}
        performanceMode="development"
      />
    </div>
  );
};

export default ContactContent;
