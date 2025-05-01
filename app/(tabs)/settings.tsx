import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Sun, Moon, LogOut, Bell, Shield, HelpCircle } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';

export default function SettingsScreen() {
  const { colors, isDark, setTheme, theme } = useTheme();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <HeaderBar title="Settings" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            
            <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingContent}>
                {isDark ? <Moon size={22} color={colors.text} /> : <Sun size={22} color={colors.text} />}
                <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={'white'}
              />
            </View>
            
            <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingContent}>
                <Bell size={22} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
              </View>
              <ChevronRight size={18} color={colors.subtext} />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
            
            <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingContent}>
                <Shield size={22} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>Biometric Authentication</Text>
              </View>
              <ChevronRight size={18} color={colors.subtext} />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
            
            <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.settingContent}>
                <HelpCircle size={22} color={colors.text} />
                <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
              </View>
              <ChevronRight size={18} color={colors.subtext} />
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <LogOut size={22} color={colors.negative} />
            <Text style={[styles.logoutText, { color: colors.negative }]}>Logout</Text>
          </TouchableOpacity>
          
          <Text style={[styles.versionText, { color: colors.subtext }]}>
            CryptoTracker v1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    fontSize: 15,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});