import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

export function useCreateExplanation() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const date = route.params?.date;

  const [content, setContent] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canSubmit = useMemo(() => content.trim().length > 0, [content]);

  const onSubmit = () => {
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const closeConfirm = () => setConfirmOpen(false);

  const onConfirm = () => {
    setConfirmOpen(false);
    navigation.navigate('TimekeepingDetail', { tab: 'explanation', date });
  };

  return {
    content,
    setContent,
    confirmOpen,
    canSubmit,
    onSubmit,
    closeConfirm,
    onConfirm,
  };
}
