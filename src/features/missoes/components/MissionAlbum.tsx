import { useEffect, useState } from 'react';
import { Image, Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomPanel } from '@/components/BottomPanel';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { showToast } from '@/components/Toast';
import { useTheme } from '@/theme/useTheme';
import { useMissionPhotosStore, type MissionPhoto } from '../useMissionPhotosStore';

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
const fmtFull = (ms: number) =>
  new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

// Álbum das missões concluídas com foto (grade). Toque abre a foto no MissionPhotoViewer.
export function MissionAlbum({ onOpen }: { onOpen: (photo: MissionPhoto) => void }) {
  const { colors, fs } = useTheme();
  const photos = useMissionPhotosStore((s) => s.photos);

  return (
    <View style={styles.c}>
      <View style={styles.head}>
        <Eyebrow>Álbum das missões</Eyebrow>
        {photos.length > 0 && (
          <Text style={[styles.count, { color: colors.muted, fontSize: fs(12.5) }]}>
            {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
          </Text>
        )}
      </View>

      {photos.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Feather name="camera" size={22} color={colors.faint} />
          <Text
            style={[styles.emptyTxt, { color: colors.muted, fontSize: fs(13), lineHeight: fs(19) }]}
          >
            Ao concluir uma missão, você pode tirar uma foto do momento. Ela aparece aqui, só no seu
            aparelho.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {photos.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => onOpen(p)}
              style={styles.cell}
              accessibilityRole="imagebutton"
              accessibilityLabel={`${p.title}, ${fmtFull(p.takenAt)}`}
              accessibilityHint="Abre a foto"
            >
              <Image
                source={{ uri: p.uri }}
                style={[styles.thumb, { backgroundColor: colors.surface2 }]}
              />
              <View style={styles.tag}>
                <Text style={[styles.tagTxt, { fontSize: fs(10.5) }]}>{fmtDate(p.takenAt)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/** Foto grande do álbum, com data e opção de apagar. Monte na raiz da tela (cobre tudo). */
export function MissionPhotoViewer({
  photo: open,
  onClose,
}: {
  photo: MissionPhoto | null;
  onClose: () => void;
}) {
  const { colors, fs } = useTheme();
  const remove = useMissionPhotosStore((s) => s.remove);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => setConfirmDelete(false), [open?.id]);
  const close = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <BottomPanel visible={open !== null} title={open?.title ?? ''} onClose={close}>
      {open && (
        <>
          <Image
            source={{ uri: open.uri }}
            style={[styles.big, { backgroundColor: colors.surface2 }]}
            resizeMode="cover"
            accessibilityLabel={`Foto da missão ${open.title}`}
          />
          <Text style={[styles.date, { color: colors.muted, fontSize: fs(13) }]}>
            Concluída em {fmtFull(open.takenAt)}
          </Text>
          <Button
            label={confirmDelete ? 'Toque de novo para apagar' : 'Apagar foto'}
            variant="soft"
            icon="trash-2"
            onPress={() => {
              if (!confirmDelete) return setConfirmDelete(true);
              remove(open.id);
              close();
              showToast('Foto apagada');
            }}
            accessibilityHint="A missão continua concluída; só a foto é apagada"
          />
          <Button label="Fechar" variant="ghost" onPress={close} />
        </>
      )}
    </BottomPanel>
  );
}

const styles = StyleSheet.create({
  c: { gap: 10, marginTop: 6 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontWeight: '600' },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTxt: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '31.8%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  tag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(10,22,46,0.65)',
  },
  tagTxt: { color: '#fff', fontWeight: '700' },
  big: { width: '100%', aspectRatio: 3 / 4, maxHeight: 420, borderRadius: 16 },
  date: { textAlign: 'center' },
});
