import { useLocalSearchParams } from "expo-router";
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
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: { ability: { name: string } }[];
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

const getTypeColor = (typeName: string) =>
  colorsByType[typeName as PokemonTypeName] ?? "#A8A77A";

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const formatStatName = (name: string) => {
  const map: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return map[name] ?? capitalizeFirst(name);
};

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemon();
  }, [name]);

  const fetchPokemon = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EE8130" />
        <Text style={styles.loadingText}>Loading Pokemon...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Pokemon not found</Text>
      </View>
    );
  }

  const typeColor = getTypeColor(pokemon.types[0].type.name);

  return (
    <ScrollView
      style={[
        styles.scrollView,
        {
          backgroundColor: `${typeColor}20`,
        },
      ]}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.pokemonName}>{capitalizeFirst(pokemon.name)}</Text>

      <View style={styles.typeBadgesContainer}>
        {pokemon.types.map((t, index) => (
          <View
            key={t.type.name}
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(t.type.name) },
              index > 0 ? styles.typeBadgeSpacing : null,
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {capitalizeFirst(t.type.name)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.pokemonImage}
        />
        <Image
          source={{ uri: pokemon.sprites.back_default }}
          style={styles.pokemonImage}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>
              {formatStatName(stat.stat.name)}
            </Text>
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBar,
                  {
                    width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                    backgroundColor: typeColor,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((a, index) => (
            <View
              key={a.ability.name}
              style={[
                styles.abilityBadge,
                { borderColor: typeColor },
                index > 0 ? styles.abilityBadgeSpacing : null,
              ]}
            >
              <Text>{capitalizeFirst(a.ability.name.replace("-", " "))}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12 },
  pokemonName: { fontSize: 32, fontWeight: "bold", marginBottom: 12 },
  typeBadgesContainer: { flexDirection: "row", marginBottom: 16 },
  typeBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  typeBadgeSpacing: { marginLeft: 10 },
  typeBadgeText: { color: "#fff", fontWeight: "600" },
  imageContainer: { flexDirection: "row" },
  pokemonImage: { width: 140, height: 140 },
  sectionCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  statName: { width: 90 },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  statBar: { height: "100%", borderRadius: 4 },
  abilitiesContainer: { flexDirection: "row", flexWrap: "wrap" },
  abilityBadge: {
    borderWidth: 2,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  abilityBadgeSpacing: { marginLeft: 8 },
});
