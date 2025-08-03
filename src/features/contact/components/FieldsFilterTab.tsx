import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group';

const FieldsFilterTab = () => {
  return (
    <ToggleGroup
      type="single"
      className="w-full flex mb-3 border"
      defaultValue="all-fields"
    >
      <ToggleGroupItem
        value="all-fields"
        aria-label="All Fields"
        className=" border-r-1 h-7"
      >
        All Fields
      </ToggleGroupItem>
      <ToggleGroupItem value="dnd" aria-label="DND" className="border-r-1 h-7">
        DND
      </ToggleGroupItem>
      <ToggleGroupItem
        value="actions"
        aria-label="Actions"
        className="border-r-1 h-7"
      >
        Actions
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default FieldsFilterTab;
