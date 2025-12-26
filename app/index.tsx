import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface PokemonType {
  type: { name: string };
}

interface Pokemon {
  name: string;
  frontImageUrl: string;
  backImageUrl: string;
  types: PokemonType[];
}

type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

const colorsByType: Record<PokemonTypeName, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const getTypeColor = (type: string) =>
  colorsByType[type as PokemonTypeName] ?? "#A8A77A";

export default function Index() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await res.json();

      const list = await Promise.all(
        data.results.map(async (p: any) => {
          const r = await fetch(p.url);
          const d = await r.json();
          return {
            name: d.name,
            frontImageUrl: d.sprites.front_default,
            backImageUrl: d.sprites.back_default,
            types: d.types,
          };
        }),
      );

      setPokemonList(list);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EE8130" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ ...styles.scrollView }}
      contentContainerStyle={styles.container}
    >
      {pokemonList.map((p, index) => {
        const typeColor = getTypeColor(p.types[0].type.name);

        return (
          <Link
            key={p.name}
            href={{ pathname: "/details", params: { name: p.name } }}
          >
            <View
              style={{
                ...styles.card,
                display: "flex",
                alignItems: "center",
                backgroundColor: `${typeColor}30`,
                borderColor: typeColor,
                ...(index > 0 ? styles.cardSpacing : {}),
              }}
            >
              <Text style={styles.name}>{p.name}</Text>

              <View style={styles.typeBadgesContainer}>
                {p.types.map((t, i) => (
                  <View
                    key={t.type.name}
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeColor(t.type.name) },
                      i > 0 ? styles.typeBadgeSpacing : null,
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>{t.type.name}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: p.frontImageUrl }}
                  style={styles.pokemonImage}
                />
                <Image
                  source={{ uri: p.backImageUrl }}
                  style={styles.pokemonImage}
                />
              </View>
            </View>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 16, padding: 16, borderWidth: 2 },
  cardSpacing: { marginTop: 16 },
  name: { fontSize: 24, fontWeight: "bold" },
  typeBadgesContainer: { flexDirection: "row", marginVertical: 8 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  typeBadgeSpacing: { marginLeft: 8 },
  typeBadgeText: { color: "#fff" },
  imageContainer: { flexDirection: "row", justifyContent: "center" },
  pokemonImage: { width: 120, height: 120 },
});
