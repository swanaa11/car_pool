import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { Link } from "expo-router";
import { useI18n } from "../../src/lib/i18n";
import { useColors, useTheme } from "../../src/lib/theme";

export default function Search() {
  const { dict, locale, setLocale } = useI18n();
  const c = useColors();
  const { toggle, isDark } = useTheme();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const search = async () => {
    setLoading(true);
    let q = supabase.from("rides").select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,rating_avg)").eq("status", "SCHEDULED").gte("departure_at", new Date().toISOString()).order("departure_at").limit(20);
    if (from) q = (q as any).ilike("origin_label", `%${from}%`);
    if (to) q = (q as any).ilike("destination_label", `%${to}%`);
    if (date) {
      const s = new Date(date);
      const e = new Date(date);
      e.setDate(e.getDate() + 1);
      q = q.gte("departure_at", s.toISOString()).lt("departure_at", e.toISOString());
    }
    const { data } = await q;
    setRides(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      {/* Header with lang + theme */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "900", color: c.text }}>{dict.search?.title ?? "Fahrt finden"}</Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Pressable onPress={toggle} style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, color: c.text }}>{isDark ? "☀️ Light" : "🌙 Dark"}</Text>
          </Pressable>
          <View style={{ flexDirection: "row", backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 999, padding: 2 }}>
            <Pressable onPress={() => setLocale("de")} style={{ backgroundColor: locale === "de" ? c.primary : "transparent", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
              <Text style={{ color: locale === "de" ? "white" : c.muted, fontWeight: "700", fontSize: 12 }}>DE</Text>
            </Pressable>
            <Pressable onPress={() => setLocale("en")} style={{ backgroundColor: locale === "en" ? c.primary : "transparent", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
              <Text style={{ color: locale === "en" ? "white" : c.muted, fontWeight: "700", fontSize: 12 }}>EN</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Hero card */}
      <View style={{ backgroundColor: c.primary, borderRadius: 24, padding: 16, gap: 8 }}>
        <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>{dict.hero?.title ?? "Teile deine Fahrt"}</Text>
        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>{dict.hero?.subtitle ?? "Gemeinsam fahren in Deutschland"}</Text>
      </View>

      <View style={{ backgroundColor: c.card, borderRadius: 20, padding: 14, gap: 10, borderWidth: 1, borderColor: c.border, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 }}>
        <TextInput placeholder={dict.search?.from ?? "Von"} placeholderTextColor={c.muted} value={from} onChangeText={setFrom} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, color: c.text, backgroundColor: c.bg }} />
        <TextInput placeholder={dict.search?.to ?? "Nach"} placeholderTextColor={c.muted} value={to} onChangeText={setTo} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, color: c.text, backgroundColor: c.bg }} />
        <TextInput placeholder="YYYY-MM-DD" placeholderTextColor={c.muted} value={date} onChangeText={setDate} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, color: c.text, backgroundColor: c.bg }} />
        <Pressable onPress={search} style={{ backgroundColor: c.primary, padding: 14, borderRadius: 12, alignItems: "center", shadowColor: c.primary, shadowOpacity: 0.3, shadowRadius: 8 }}>
          <Text style={{ color: "white", fontWeight: "800" }}>🔍 {dict.search?.searchBtn ?? "Suchen"}</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={c.primary} />
      ) : (
        rides.map((r) => (
          <Link key={r.id} href={`/ride/${r.id}` as any} asChild>
            <Pressable style={{ backgroundColor: c.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: c.border, gap: 4 }}>
              <Text style={{ fontWeight: "800", color: c.text }}>{r.origin_label} → {r.destination_label}</Text>
              <Text style={{ color: c.muted, fontSize: 12 }}>{new Date(r.departure_at).toLocaleString(locale === "de" ? "de-DE" : "en-GB")} · {r.seats_available} {dict.search?.seats ?? "Seats"} · {(r.contribution_cents / 100).toFixed(2).replace(".", ",")} €</Text>
              <Text style={{ color: c.muted, fontSize: 12 }}>{dict.ride?.detail ?? "Driver"}: {r.driver?.first_name} ★ {Number(r.driver?.rating_avg ?? 5).toFixed(1)}</Text>
            </Pressable>
          </Link>
        ))
      )}
      {!loading && rides.length === 0 && <Text style={{ textAlign: "center", color: c.muted, marginTop: 20 }}>{dict.search?.noResults}</Text>}
    </ScrollView>
  );
}
