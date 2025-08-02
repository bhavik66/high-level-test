import {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardHeader,
} from '@/components/LayoutViewCard';

import ContactCard from '@/features/contact/components/ContactCard';
import FieldsFilterTab from '@/features/contact/components/FieldsFilterTab';
import SearchFieldInput from '@/features/contact/components/SearchFieldInput';

import ContactContent from './ContactContent';
import ContactHeader from './ContactHeader';

const ContactView = () => {
  return (
    <LayoutViewCard>
      <LayoutViewCardHeader>
        <ContactHeader />
      </LayoutViewCardHeader>
      <LayoutViewCardContent>
        <ContactCard />
        <FieldsFilterTab />
        <SearchFieldInput />
        <ContactContent />
      </LayoutViewCardContent>
    </LayoutViewCard>
  );
};

export default ContactView;
