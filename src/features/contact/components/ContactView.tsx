import {
  FeatureCard,
  FeatureCardContent,
  FeatureCardHeader,
} from '@/shared/components/containers';

import ContactCard from '@/features/contact/components/ContactCard';
import FieldsFilterTab from '@/features/contact/components/FieldsFilterTab';
import SearchFieldInput from '@/features/contact/components/SearchFieldInput';

import ContactContent from './ContactContent';
import ContactHeader from './ContactHeader';

const ContactView = () => {
  return (
    <FeatureCard>
      <FeatureCardHeader>
        <ContactHeader />
      </FeatureCardHeader>
      <FeatureCardContent>
        <ContactCard />
        <FieldsFilterTab />
        <SearchFieldInput />
        <ContactContent />
      </FeatureCardContent>
    </FeatureCard>
  );
};

export default ContactView;
