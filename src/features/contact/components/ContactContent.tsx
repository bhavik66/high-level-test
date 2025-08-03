import { ConfigurableFormRenderer } from '@/components/dynamic-forms';
import { LoadingFallback } from '@/components/fallbacks';
import { useContactData, useFormDefinition } from '@/features/contact/hooks';

const ContactContent = () => {
  // Separate hooks for different concerns
  const {
    formDefinition,
    loading: formDefinitionLoading,
    error: formDefinitionError,
    refetch: refetchFormDefinition,
  } = useFormDefinition('contactForm');

  const {
    formValues,
    setFormValues,
    saveFormValues,
    loading: contactDataLoading,
    error: contactDataError,
    isSaving,
    refetch: refetchContactData,
  } = useContactData('1');

  const handleValuesChange = async (newValues: Record<string, unknown>) => {
    console.log('Form values changed:', newValues);
    setFormValues(newValues);

    // Auto-save after user stops typing (debounced save could be implemented)
    try {
      await saveFormValues(newValues);
      console.log('Form data saved successfully');
    } catch (error) {
      console.error('Failed to save form data:', error);
      // In a production app, you might show a toast notification here
    }
  };

  // Show loading state while fetching initial data
  const isLoading = formDefinitionLoading || contactDataLoading;
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingFallback componentName="Contact Form" />
      </div>
    );
  }

  // Handle form reload without full page refresh
  const handleRetry = async () => {
    try {
      if (formDefinitionError) {
        await refetchFormDefinition();
      }
      if (contactDataError) {
        await refetchContactData();
      }
    } catch (error) {
      console.error('Failed to retry loading form data:', error);
    }
  };

  // Show error state if there's an error loading critical data
  if (formDefinitionError || contactDataError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Failed to Load Form
          </h3>
          <p className="text-gray-600 mb-4">
            {formDefinitionError || contactDataError}
          </p>
          <div className="space-x-2">
            <button
              onClick={handleRetry}
              disabled={formDefinitionLoading || contactDataLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formDefinitionLoading || contactDataLoading
                ? 'Retrying...'
                : 'Try Again'}
            </button>
            {formDefinitionError && contactDataError && (
              <div className="mt-2 text-sm text-gray-500">
                <button
                  onClick={() => refetchFormDefinition()}
                  disabled={formDefinitionLoading}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Retry Form Definition
                </button>
                <button
                  onClick={() => refetchContactData()}
                  disabled={contactDataLoading}
                  className="text-blue-600 hover:underline"
                >
                  Retry Contact Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Don't render if form definition is not available
  if (!formDefinition) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Form definition not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto relative">
      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm z-10">
          Saving...
        </div>
      )}

      <ConfigurableFormRenderer
        formDefinition={formDefinition}
        values={formValues}
        onValuesChange={handleValuesChange}
        performanceMode="development"
      />
    </div>
  );
};

export default ContactContent;
